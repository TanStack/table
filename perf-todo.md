# `@tanstack/table-core` — Performance Refactor Catalog: Todo

Generated from `perf.md`. The original `perf.md` is intentionally preserved.
2026-07-01: merged with the fresh audit in `perf.md` (findings A1–F18 and verification new-risks mapped to entries 62–147; legacy entries 1–61 retained).

Entries are sorted by adjusted effectiveness score descending.

## Counts

- **Entries:** 83
- **Source findings:** 83
- **Cross-cutting sweeps:** 0
- 2026-07-03: #102 (C9) completed and moved to perf-done.md.

## Score 8

## 65. F1: Svelte useSelector subscribes with `===` compare: every subscriber re-renders on every atom write — Score: 8

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/svelte-table/src/createTable.svelte.ts:125`
**Category:** `memoization`

Hot path: Every state atom write (resize tick = 2 writes at 60-120Hz, selection, sorting, everything) → store snapshot recompute → `useSelector` subscription callback. `@tanstack/svelte-store`'s `useSelector` defaults `compare` to `===` (verified: `defaultCompare(a,b){return a===b}` and `options.compare ?? defaultCompare`). The store snapshot is a fresh object on every recompute, and the idiomatic selector (`(state) => ({ pagination: state.pagination })`) returns a fresh object too, so `compare(slice, data)` is always false, `slice = data` writes the `$state` rune on EVERY table state write, and every template reading `table.state` re-renders per tick even when the selected slice is unchanged. Verified: even the default no-selector path re-assigns the `$state` slice on every write (identity selector over a fresh snapshot). The sibling `subscribe.ts:45` correctly passes `{ compare: shallow }`, as do React/Preact `useTable`.

**Before**

```ts
// 5. State selector
const stateStore = useSelector(table.store, selector)
```

**After**

```ts
import { shallow, useSelector } from '@tanstack/svelte-store'
// ...
const stateStore = useSelector(table.store, selector, { compare: shallow })
```

**Big-O:** O(writes × subscribers) re-renders → O(changed-slice writes × subscribers). At 100Hz resize with a `pagination` selector: 200 spurious `$state` invalidations/sec eliminated per consumer, each of which cascades to a Svelte template re-evaluation over the visible grid. Shallow compare additionally avoids re-proxying the slice per tick.

**Risk:** Matches react/preact/subscribe.ts behavior exactly; only risk is a consumer relying on re-render-per-write with an identity selector (they should use `subscribe`/atoms for that).
**Verification:** CONFIRMED (drop-in, adapter-wide, per-write).

---

## Score 7

## 28. Row filter state reset allocates even when already reset (superseded by B2: rowModel-marker skip of the O(R) tag-map reset) — Score: 7

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/column-filtering/createFilteredRowModel.ts:57–67` (plus `columnFilteringFeature.ts:72–75`)
**Category:** `big-o` (short-circuit), `allocation`

Original #28 (score 1) proposed skipping the `row.columnFilters = {}` write when already an empty object. The 2026-07-01 audit (B2, score 7) supersedes it with the full analysis. Hot path: every `data` change (and every transition to empty filters) on tables with the filtered model registered but no active filters. `columnFilteringFeature.initRowInstanceData` already assigns fresh `columnFilters`/`columnFiltersMeta` maps in `constructRow`, so whenever the recompute is triggered by a data change (fresh rows), the empty-filter reset loop is pure waste: O(R) iterations + 2R `Object.create(null)` allocations (200k allocs at R=100k). The loop is only needed to clear stale tags when transitioning active-filters → no-filters over the SAME row objects.

**Before**

```ts
if (!rowModel.rows.length || (!columnFilters?.length && !globalFilter)) {
  const flatRows = rowModel.flatRows as Array<
    Row<TFeatures, TData> & Partial<Row_ColumnFiltering<TFeatures, TData>>
  >
  for (let i = 0; i < flatRows.length; i++) {
    const row = flatRows[i]!
    row.columnFilters = makeObjectMap()
    row.columnFiltersMeta = makeObjectMap()
  }
  return rowModel
}
```

**After** (verifier's rowModel-marker variant, which replaces the finder's closure-flag: mark the exact model object whose flatRows were tagged, and clear only when the marker is present — the marker travels with the tagged rowModel object)

```ts
// after the tagging loop completes in the filtered branch:
;(rowModel as any)._filterTagsDirty = true
// (equivalently: a module-level WeakSet<RowModel> of tagged models)

// in the empty-filter branch:
if (!rowModel.rows.length || (!columnFilters?.length && !globalFilter)) {
  if ((rowModel as any)._filterTagsDirty) {
    const flatRows = rowModel.flatRows as Array<
      Row<TFeatures, TData> & Partial<Row_ColumnFiltering<TFeatures, TData>>
    >
    for (let i = 0; i < flatRows.length; i++) {
      const row = flatRows[i]!
      row.columnFilters = makeObjectMap()
      row.columnFiltersMeta = makeObjectMap()
    }
    delete (rowModel as any)._filterTagsDirty
  }
  return rowModel
}
```

memoDeps unchanged (`[preFilteredRowModel, columnFilters, globalFilter]`).

**Big-O:** O(R) → O(1) on the unfiltered data-change path: ~100k iterations + 200k null-proto object allocations saved per data update at R=100k (~5–10ms + GC pressure).

**Risk:** The marker travels with the exact object whose flatRows were tagged, so it stays correct under every sequence, including custom `features.coreRowModel` implementations with multi-slot caching (where the finder's closure flag would desync when an old tagged rowModel object resurfaces) and the filters-active-over-empty-rowModel case. No signature threading needed.
**Verification:** AMENDED: the verifier's rowModel-marker variant replaces the finder's closure-flag proposal (closure flag desyncs under custom core row models and goes conservatively wrong over empty models).

---

## 68. A4: column_getIndex: O(N) findIndex per column, O(N²) cascade per ordering change → table-level index records — Score: 7

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/features/column-ordering/columnOrderingFeature.utils.ts:37–47`; registration at `columnOrderingFeature.ts:36–45`
**Category:** `big-o`

Hot path: Per state-change (columnOrder/columnPinning/grouping/columnVisibility): all N per-column memos invalidate; each recompute is an O(N) scan → O(N²). Also on first render. (Not per-tick: `columnSizing` is correctly absent from its deps.) `findIndex` with a fresh closure per recompute, O(N) per column. After any ordering-affecting state change, every column recomputes → O(N²) id comparisons (N=500 → 250k). With A1 applied the internal callers disappear, but `getIndex` remains public API. Since the iterated dimension scales with N, a keyed record is warranted.

**Before**

```ts
export function column_getIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  position?: ColumnPinningPosition | 'center',
) {
  const columns = table_getPinnedVisibleLeafColumns(column.table, position)
  return columns.findIndex((d) => d.id === column.id)
}
```

**After**

(Table-level index records, all four position keys in ONE memo so there is no single-slot thrash; unmemoized per-column lookup.)

```ts
// columnOrderingFeature.utils.ts
export function table_getColumnIndexes<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const buildIndexes = (
    columns: Array<Column<TFeatures, TData, unknown>>,
  ): Record<string, number> => {
    const indexes = makeObjectMap<number>()
    for (let i = 0; i < columns.length; i++) {
      indexes[columns[i]!.id] = i
    }
    return indexes
  }

  return {
    all: buildIndexes(table_getPinnedVisibleLeafColumns(table)),
    center: buildIndexes(table_getPinnedVisibleLeafColumns(table, 'center')),
    left: buildIndexes(table_getPinnedVisibleLeafColumns(table, 'left')),
    right: buildIndexes(table_getPinnedVisibleLeafColumns(table, 'right')),
  }
}

export function column_getIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  position?: ColumnPinningPosition | 'center',
) {
  const indexes = callMemoOrStaticFn(
    column.table,
    'getColumnIndexes',
    table_getColumnIndexes,
  )
  const key =
    position === 'left'
      ? 'left'
      : position === 'right'
        ? 'right'
        : position === 'center'
          ? 'center'
          : 'all'
  return indexes[key][column.id] ?? -1
}
```

```ts
// columnOrderingFeature.ts
    assignTableAPIs('columnOrderingFeature', table, {
      table_getColumnIndexes: {
        fn: () => table_getColumnIndexes(table),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnOrder?.get(),
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
          table.atoms.grouping?.get(),
          table.options.groupedColumnMode,
        ],
      },
      // ...
    })
    // column_getIndex: drop memoDeps, register as a plain prototype fn:
      column_getIndex: {
        fn: (column, position) => column_getIndex(column, position),
      },
```

Deps coverage: same transitive chain as A1 (columns, columnOrder, columnPinning, columnVisibility, grouping, groupedColumnMode); no `columnSizing`, so resize ticks never invalidate index records. Keep this memo SEPARATE from A1's offsets memo. `?? -1` preserves miss semantics.

**Big-O:** O(N²) → O(N) per ordering state-change (N=500: 250k comparisons + N closures → 500 loop iterations, 4 record allocs). Removes N per-instance `_memo_getIndex` closures.

**Risk:** Low. The proposed deps are a strict superset of the current ones (adds `options.columns` and `groupedColumnMode`, closing a small `groupedColumnMode` staleness gap). Duplicate column ids would flip first-wins to last-wins; ids are unique by construction, or guard with `if (indexes[id] === undefined)`.
**Verification:** CONFIRMED (deps superset verified; no import cycle; keep offsets/index memos separate exactly as proposed).

---

## 69. B5: Per-row early exit across filters once the row has failed, gated on faceting absence — Score: 7

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/features/column-filtering/createFilteredRowModel.ts:121–167` (decision loop at 170–180)
**Category:** `big-o` (short-circuit)

Hot path: Per state-change: tagging pass over all R flatRows, every filter keystroke. Every row is evaluated against ALL column filters, and the global loop runs regardless of column-filter outcomes. The full tag matrix is only consumed by `createFacetedRowModel` (each faceted column excludes its own filter and needs every OTHER filter's verdict). The final decision (`filterRowsImpl`) checks ids in tagging order, so it hits the first `false` before any missing later tag: evaluation after the first failure is pure waste whenever faceting is not registered. With a selective first filter (90% fail) and F=3+global, that is ~R×(F-1) wasted filterFn invocations plus whole global-filter scans for already-failed rows.

**Before**

```ts
    if (resolvedColumnFilters.length) {
      for (let j = 0; j < resolvedColumnFilters.length; j++) {
        const currentColumnFilter = resolvedColumnFilters[j]!
        const id = currentColumnFilter.id

        // Tag the row with the column filter state
        row.columnFilters[id] = currentColumnFilter.filterFn(
          row,
          id,
          // ...
```

**After**

```ts
const needsAllFilterTags = !!table.options.features.facetedRowModel

// inside the flatRows loop:
let failed = false
if (resolvedColumnFilters.length) {
  for (let j = 0; j < resolvedColumnFilters.length; j++) {
    const currentColumnFilter = resolvedColumnFilters[j]!
    const id = currentColumnFilter.id
    metaId = id
    const pass = currentColumnFilter.filterFn(
      row,
      id,
      currentColumnFilter.resolvedValue,
      addMeta,
    )
    row.columnFilters[id] = pass
    if (pass === false) {
      failed = true
      if (!needsAllFilterTags) break
    }
  }
}

if (resolvedGlobalFilters.length && !(failed && !needsAllFilterTags)) {
  // ...existing global loop...
}
```

`filterRowsImpl` is untouched: id order in `filterableIds` matches `resolvedColumnFilters` order, so the first stored `false` short-circuits before any untagged id is read.

**Big-O:** Worst case unchanged O(R×F); typical selective-filter case drops to ~O(R×1) filterFn calls. At R=100k, F=3, 90% fail-on-first: ~180k filterFn calls saved per keystroke (~10-30ms), plus skipped global-filter scans.

**Risk:** Verifier completed the consumer sweep: tags are read only by the two `filterRowsImpl`s and the faceted model; `columnFiltersMeta` has zero in-repo readers; the read-order proof holds even with missing-column filter ids; strict `pass === false` matches `filterRowsImpl` semantics exactly; `!!table.options.features.facetedRowModel` is the correct gate (the fallback faceted path reads no tags). Residual documented delta: public `row.columnFilters`/`columnFiltersMeta` become partial on failed rows. Do NOT apply the skip when faceting is registered.
**Verification:** CONFIRMED (consumer sweep and read-order proof completed by verifier).

---

## 70. B19: constructRow allocates Object.values(table.\_features) and probes all features per row — Score: 7

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/core/rows/constructRow.ts:60–64` (called O(R) times from createCoreRowModel.ts:60–68, filterRowsUtils, createGroupedRowModel)
**Category:** `allocation`

Hot path: Per state-change: R times per core model rebuild (every data change), plus every filtered/grouped clone. `Object.values` allocates a fresh ~15-25 element array on EVERY row construction: 100k array allocations per data change at R=100k. The loop then probes `initRowInstanceData` on every feature although only 2 define it (verified: columnFilteringFeature and columnGroupingFeature): ~2M optional-chain probes per rebuild. `table._features` is fixed at construct time.

**Before**

```ts
// Initialize instance-specific data (e.g., caches) for features that need it
const features = Object.values(table._features)
for (let i = 0; i < features.length; i++) {
  features[i]!.initRowInstanceData?.(row)
}
```

**After**

(Cache next to the row prototype, same lazy pattern as `getRowPrototype`.)

```ts
function getRowInitFeatures<...>(table: Table_Internal<TFeatures, TData>) {
  if (!table._rowInitFeatures) {
    const all = Object.values(table._features)
    const withInit = []
    for (let i = 0; i < all.length; i++) {
      if (all[i]!.initRowInstanceData) withInit.push(all[i]!)
    }
    table._rowInitFeatures = withInit
  }
  return table._rowInitFeatures
}

  // in constructRow:
  const features = getRowInitFeatures(table)
  for (let i = 0; i < features.length; i++) {
    features[i]!.initRowInstanceData!(row)
  }
```

**Big-O:** R array allocations → 0 per rebuild (100k arrays saved at R=100k); feature probes drop from R×|features| to R×|features-with-init| (~2M → ~200k). Several ms + significant GC relief on data-churny tables.

**Risk:** Requires a `_rowInitFeatures` internal field on `Table_Internal`. If a plugin mutated `table._features` post-construction the cache would go stale, but `_rowPrototype` already bakes in the same fixed-features invariant, so no new assumption.
**Verification:** CONFIRMED (invariant matches `_rowPrototype`; only 2 features define initRowInstanceData).

---

## 71. C2: table_getCenterRows: no empty-pinning short-circuit; O(R) filter + broken referential identity — Score: 7

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts:188–198`
**Category:** `big-o` (short-circuit)

Hot path: Recomputes on every row-model change and every rowPinning state change (memoDeps `[rows, rowPinning]`, rowPinningFeature.ts:88-94). Adapters using row pinning call `getCenterRows()` every render. When nothing is pinned (the overwhelmingly common state even with the feature enabled), this still allocates a Set, two spreads, a closure, and a new R-length array on every row-model change. Worse, the new array is not reference-equal to `getRowModel().rows`, defeating downstream adapter memoization keyed on row-array identity.

**Before**

```ts
const { top, bottom } =
  table.atoms.rowPinning?.get() ?? getDefaultRowPinningState()
const allRows = table.getRowModel().rows

const topAndBottom = new Set([...top, ...bottom])
return allRows.filter((d) => !topAndBottom.has(d.id))
```

**After**

```ts
const { top, bottom } =
  table.atoms.rowPinning?.get() ?? getDefaultRowPinningState()
const allRows = table.getRowModel().rows

if (!top.length && !bottom.length) return allRows // no pinning, return early

const topAndBottom = new Set([...top, ...bottom])
return allRows.filter((d) => !topAndBottom.has(d.id))
```

**Big-O:** O(R) filter + R-array allocation → O(1) in the unpinned case; preserves `rows` identity for adapters. At R=100k: 100k closure invocations + a 100k-slot array eliminated per row-model change.

**Risk:** (a) Behavior delta to flag: the returned array becomes reference-identical to `getRowModel().rows`, an identity-stability win for adapter memoization, but caller mutation of the result would now corrupt the row model (callers already must not mutate the filtered result). (b) Precedent correction: the pattern to cite is `table_getPreSelectedRowModel` returning the core model object, not `row_getVisibleCells` line 161 (that early return yields a locally built array). No in-repo or in-examples mutation of the result exists (examples only `.map`).
**Verification:** AMENDED: precedent citation corrected; identity-return behavior delta flagged explicitly.

---

## 72. D1: Per-key state atoms reactively track the entire optionsStore (invalidation storm on every options write) — Score: 7

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/core/table/constructTable.ts:138–150`
**Category:** `render-path`, `memoization`

Hot path: Every `optionsStore.set()` in adapters with `createOptionsStore: true` (solid, vue, svelte, angular, lit, alpine, vanilla store bindings). These adapters sync options on prop/render updates, so this fires per adapter update pass. When `createOptionsStore: true`, `table.options` is a defineProperty getter calling `table.optionsStore.get()`. Reading it inside the computed links `optionsStore` as a reactive dependency of ALL K per-key atoms (verified in `@tanstack/store@0.11` atom.ts: any `.get()` under an `activeSub` links). Every options write (always a fresh object, `Object.is` fails) propagates dirtiness through all K per-key atoms, the `table.store` snapshot atom, and every subscribed effect: O(K + S) checkDirty/queue churn per options update for zero state change. The tracked read is provably unnecessary: `table_mergeOptions` unconditionally restores the construct-time `atoms` reference on every merge path, and `wrapExternalAtoms` replaces `mergedOptions.atoms` entries before this loop runs, so `options.atoms` identity is construct-stable under the public API. `_reactivity.untrack` cannot fix this (react/vanilla bindings define it as identity).

**Before**

```ts
// create readonly derived atom: on each get(), read either external atom or base atom
;(table.atoms as any)[key] = _reactivity.createReadonlyAtom(
  () => {
    const externalAtoms = table.options.atoms as
      | Partial<Record<keyof TableState_All, Atom<unknown>>>
      | undefined
    const externalAtom = externalAtoms?.[key]
    if (externalAtom) {
      return externalAtom.get()
    }
    return table.baseAtoms[key]!.get()
  },
  { debugName: `table/atoms/${key}` },
)
```

**After**

```ts
const externalAtoms = mergedOptions.atoms as
  | Partial<Record<keyof TableState_All, Atom<unknown>>>
  | undefined

for (let i = 0; i < stateKeys.length; i++) {
  const key = stateKeys[i]!
  table.baseAtoms[key] = _reactivity.createWritableAtom(
    table.initialState[key],
    {
      debugName: `table/baseAtoms/${key}`,
    },
  ) as any

  const externalAtom = externalAtoms?.[key]
  ;(table.atoms as any)[key] = _reactivity.createReadonlyAtom(
    externalAtom ? () => externalAtom.get() : () => table.baseAtoms[key]!.get(),
    { debugName: `table/atoms/${key}` },
  )
}
```

Transitive inputs: `externalAtom` (construct-stable, restored by `table_mergeOptions` on every merge path; wrapped before this loop) and `table.baseAtoms[key]` (assigned exactly once, never reassigned; `makeStateUpdater` only calls `.set()` on it).

**Big-O:** Per options-only update in store-backed adapters: eliminates K (~15) computed recomputations plus dep-graph unlink/relink churn, one snapshot-atom Pending walk, and O(S) effect notifications/checkDirty walks. Big-O per options write: O(K + S) → O(1). Also removes one `optionsStore.get()` plus `.atoms?.[key]` lookup from every legitimate per-key recompute.

**Risk:** Behavior change only if someone swaps `options.atoms` identity after construct; the only route is the raw `table.options = value` setter (bypasses `table_mergeOptions`), which `setOptions` cannot reach. React adapter (`createOptionsStore: false`) is unaffected either way.
**Verification:** CONFIRMED (store linking semantics, both merge paths, and all 8 adapters' write routes re-verified).

---

## 74. F2: Svelte options store is a deep $state proxy: all options.data row reads pay proxy traps — Score: 7

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/svelte-table/src/reactivity.svelte.ts:34–49,103–114`
**Category:** `render-path`

Hot path: Row model construction (O(R) row reads + O(R×N) accessor reads of `options.data`), plus every `table.options.*` feature-flag read in core per cell/row API call. With `createOptionsStore: true`, `table.options` is a getter returning `optionsStore.get()`, i.e. this rune. Svelte 5 `$state(obj)` deep-proxifies plain objects/arrays lazily: `table.options.data` returns a proxied array; `data[i]` returns proxied row objects; every accessor read of a row field in the filtered/sorted/core row model traverses reactive proxy get traps and lazily allocates child proxies. At R=100k that is 100k+ trap hits and up to 100k proxy allocations on first traversal, purely as adapter overhead. The options object is only ever replaced wholesale (`optionsStore.set(() => mergedOptions)`), so deep mutation tracking buys nothing; subscribers only track the top-level reassignment. Verified: `createRuneWritableAtom` is used only for the optionsStore, and the `$effect.pre` reads the user's options object, not the store, so nothing depends on deep reactivity.

**Before**

```ts
function createRuneWritableAtom<T>(initialValue: T): Atom<T> {
  let value = $state(initialValue)

  return {
    set: (updater: T | ((prevVal: T) => T)) => {
      value =
        typeof updater === 'function'
          ? (updater as (prevVal: T) => T)(value)
          : updater
    },
    get: () => value,
    // ...
```

**After**

```ts
function createRuneWritableAtom<T>(initialValue: T): Atom<T> {
  let value = $state.raw(initialValue)
  // set/get/subscribe unchanged; reassignment still notifies $effect subscribers
```

**Big-O:** Removes O(R×N) proxy trap hits + O(R) lazy proxy allocations per row-model rebuild; `table.options.x` flag reads in per-cell APIs drop from trap+wrap to plain property reads (~3-10× cheaper per read).

**Risk:** Loses deep reactivity of `table.options` through the rune graph (already unsupported: in-place mutation of options is not a thing). Verifier added a positive delta: `row.original` stops being a Svelte reactive proxy, so raw-object identity comparisons start working.
**Verification:** CONFIRMED (usage isolation to optionsStore verified; positive `row.original` identity delta added).

---

## 75. F3: React/Preact flexRender: dead class-component check runs an IIFE closure + prototype walk per cell — Score: 7

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/react-table/src/FlexRender.tsx:13–39,45–54`; identical in `packages/preact-table/src/FlexRender.tsx:12–40`
**Category:** `allocation`, `micro`

Hot path: Every cell/header/footer render: R_vis×N calls per render pass; whole-table renders happen per resize tick in default (selector-less) usage. `isClassComponent(x)` implies `typeof x === 'function'`, so `isClassComponent(component) || typeof component === 'function'` reduces exactly to `typeof component === 'function'`. The dead class check nevertheless executes FIRST on every call: for the common plain-function cell renderer it allocates an IIFE closure, walks `Object.getPrototypeOf`, and does two property reads before the cheap `typeof` succeeds. `isExoticComponent` allocates a fresh 2-element array per call. At 100×500 = 50k cells per render: 50k closures + 50k prototype walks per render (per tick during resize).

**Cross-refs / gating:** Legacy entry #8 (perf-todo.md) targets the redundant `'X' in props` checks in core's `flex-render.ts` dispatch; this finding removes the adjacent dead class-component check in the react/preact `FlexRender.tsx` dispatch. Both remain independently valid.

**Before**

```ts
function isReactComponent<TProps>(
  component: unknown,
): component is ComponentType<TProps> {
  return (
    isClassComponent(component) ||
    typeof component === 'function' ||
    isExoticComponent(component)
  )
}

function isClassComponent(component: any) {
  return (
    typeof component === 'function' &&
    (() => {
      const proto = Object.getPrototypeOf(component)
      return proto.prototype && proto.prototype.isReactComponent
    })()
  )
}

function isExoticComponent(component: any) {
  return (
    typeof component === 'object' &&
    typeof component.$$typeof === 'symbol' &&
    ['react.memo', 'react.forward_ref'].includes(component.$$typeof.description)
  )
}
```

**After**

```ts
function isReactComponent<TProps>(
  component: unknown,
): component is ComponentType<TProps> {
  return typeof component === 'function' || isExoticComponent(component)
}

function isExoticComponent(component: any) {
  if (typeof component !== 'object' || typeof component.$$typeof !== 'symbol') {
    return false
  }
  const description = component.$$typeof.description
  return description === 'react.memo' || description === 'react.forward_ref'
}
```

**Big-O:** Per full-grid render at worst case: −50k closure allocations, −50k prototype-chain reads, minus one array alloc + `.includes` scan per exotic cell. Constant factor of the type dispatch drops ~4×.

**Risk:** Very low. Logical identity proven by verifier: `isReactComponent`'s boolean is unchanged for every possible input; class components remain `typeof === 'function'` and render via `<Comp {...props} />` exactly as before. (JIT may partially sink the closure; still a clean win.)
**Verification:** CONFIRMED (logical identity proven; both packages verbatim).

---

## Score 6

## 43. `table_getCanSomeRowsExpand` lacks memoization (broadened by C4: all three expand-all getters) — Score: 6

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/row-expanding/rowExpandingFeature.ts` registration
**Category:** `memoization`

`.some(row_getCanExpand)` over `flatRows` every call. Add `memoDeps: () => [table.getPrePaginatedRowModel().flatRows, table.options.getRowCanExpand, table.options.enableExpanding]`.

**Scale impact** (worst case `.some()` walks saved when no expandable rows exist — dimension: calls × flat rows):

| Calls  | Flat rows | Before (calls × rows) | After (steady state) | Saved       |
| ------ | --------- | --------------------- | -------------------- | ----------- |
| 10     | 10        | 100                   | 0                    | 100         |
| 100    | 100       | 10,000                | 0                    | 10,000      |
| 1,000  | 1,000     | 1,000,000             | 0                    | 1,000,000   |
| 10,000 | 10,000    | 100,000,000           | 0                    | 100,000,000 |

**Risk:** None.

**2026-07-01 audit (C4, score 6 — broadened to all three getters, corrected narrative):** Unlike the row-selection twins (`table_getIsAllRowsSelected` etc., which all carry memoDeps), `table_getCanSomeRowsExpand`, `table_getIsSomeRowsExpanded`, and `table_getIsAllRowsExpanded` are registered with NO memoDeps (`rowExpandingFeature.ts:77–91`; impls `rowExpandingFeature.utils.ts:133–140, 173–179, 192–214`). Corrected narrative: `table_getIsAllRowsExpanded` already early-exits when `expanded === true`, so the expand-all-active case is O(1) today; the O(R) walk applies when `expanded` is a large map. The strongest case is `table_getCanSomeRowsExpand`: an O(R) `.some` over pre-paginated flatRows per call that never hits on flat data. `getIsSomeRowsExpanded` allocates `Object.values(expanded)` (O(E)) per call. Complete verified memoDeps:

```ts
table_getCanSomeRowsExpand: {
  fn: () => table_getCanSomeRowsExpand(table),
  memoDeps: () => [
    table.getPrePaginatedRowModel(),
    table.options.enableExpanding,
    table.options.getRowCanExpand,
  ],
},
// ...
table_getIsSomeRowsExpanded: {
  fn: () => table_getIsSomeRowsExpanded(table),
  memoDeps: () => [table.atoms.expanded?.get()],
},
table_getIsAllRowsExpanded: {
  fn: () => table_getIsAllRowsExpanded(table),
  memoDeps: () => [
    table.atoms.expanded?.get(),
    table.getRowModel(),
    table.options.getIsRowExpanded,
  ],
},
```

Deps verified complete against transitive reads (`row_getIsExpanded` → expanded atom + `options.getIsRowExpanded`; `row_getCanExpand` → `getRowCanExpand`/`enableExpanding`/`subRows` covered by model identity).

**Big-O (amended):** O(R)/O(E) per render → O(deps-compare) per render, O(R) once per expanded/row-model change.

**Risk (amended):** Low. Inline (identity-unstable) option fns degrade the memo to a small compare + recompute, negligibly worse than today, never worse in aggregate.
**Verification:** AMENDED: narrative corrected (`getIsAllRowsExpanded` is already O(1) for `expanded === true`; `getCanSomeRowsExpand` is the strongest case); deps completeness verified.

---

## 76. A5: column_getIsPinned: unmemoized per-call .map allocation on a per-cell render path — Score: 6

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts:135–151`, registered without memo at `columnPinningFeature.ts:74–76`
**Category:** `allocation`, `render-path`

Hot path: Per render: sticky-pinning layouts call `column.getIsPinned()` per visible cell and header (R_vis × N per render; see `examples/react/column-pinning-sticky`), including during resize-driven re-renders. Every call allocates an ids array via `.map` plus two `.some` closures; for leaf columns (`getLeafColumns()` returns `[column]`) that is 3 allocations to do 2 tiny `.includes` checks, and both sides always run. At 50 visible rows × 100 columns = 5,000 calls per render → ~15k transient allocations per render pass, per tick when resize re-renders. The `left`/`right` arrays themselves are tiny (1-3), so `.includes` is optimal; the waste is the closures/array, not the scan.

**Before**

```ts
export function column_getIsPinned<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
): ColumnPinningPosition | false {
  const leafColumnIds = column.getLeafColumns().map((d) => d.id)

  const { left, right } =
    column.table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()

  const isLeft = leafColumnIds.some((d) => left.includes(d))
  const isRight = leafColumnIds.some((d) => right.includes(d))

  return isLeft ? 'left' : isRight ? 'right' : false
}
```

**After**

(classic loops, no closures, right side skipped after a left hit)

```ts
export function column_getIsPinned<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
): ColumnPinningPosition | false {
  const leafColumns = column.getLeafColumns()

  const { left, right } =
    column.table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()

  for (let i = 0; i < leafColumns.length; i++) {
    if (left.includes(leafColumns[i]!.id)) {
      return 'left'
    }
  }
  for (let i = 0; i < leafColumns.length; i++) {
    if (right.includes(leafColumns[i]!.id)) {
      return 'right'
    }
  }
  return false
}
```

**Big-O:** Same O(leaf × pin) worst case, but 0 allocations per call vs 3, and early return on first hit. ~15k allocations per render eliminated at 50×100 scale. `column_getPinnedIndex` calls this and benefits too.

**Risk:** Very low. Return values and left-before-right precedence provably identical, including the group-column multi-leaf case.
**Verification:** CONFIRMED.

---

## 77. B4: Per-row-per-filter addMeta closures → one cursor closure — Score: 6

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/features/column-filtering/createFilteredRowModel.ts:116–168` (closures at 131–137 and 151–157)
**Category:** `allocation`

Hot path: Per state-change: full tagging pass over all flatRows on every filter keystroke. A fresh `addMeta` closure is allocated for every (row × filter) pair: R×F closures per recompute (200k at R=100k, F=2), plus the same pattern per (row × globally-filterable-column). The `if (!row.columnFiltersMeta)` guard inside both closures is provably dead (`row.columnFiltersMeta` is unconditionally assigned before any filterFn runs).

**Before**

```ts
row.columnFilters[id] = currentColumnFilter.filterFn(
  row,
  id,
  currentColumnFilter.resolvedValue,
  (filterMeta) => {
    if (!row.columnFiltersMeta) {
      row.columnFiltersMeta = makeObjectMap()
    }
    row.columnFiltersMeta[id] = filterMeta
  },
)
```

**After**

(one reusable closure over mutable cursor variables; the meta contract is synchronous)

```ts
let metaRow: (typeof flatRows)[number]
let metaId: string
const addMeta = (filterMeta: any) => {
  metaRow.columnFiltersMeta![metaId] = filterMeta
}

for (let i = 0; i < flatRows.length; i++) {
  const row = flatRows[i]!
  row.columnFilters = makeObjectMap()
  row.columnFiltersMeta = makeObjectMap()
  metaRow = row

  if (resolvedColumnFilters.length) {
    for (let j = 0; j < resolvedColumnFilters.length; j++) {
      const currentColumnFilter = resolvedColumnFilters[j]!
      const id = currentColumnFilter.id
      metaId = id
      row.columnFilters[id] = currentColumnFilter.filterFn(
        row,
        id,
        currentColumnFilter.resolvedValue,
        addMeta,
      )
    }
  }
  // same treatment for the resolvedGlobalFilters loop
}
```

**Big-O:** Same Big-O; ~R×F + R×(global cols evaluated) closure allocations removed per filter state change (200k+ at scale, several ms + GC pressure). Dead-branch removal saves a load+test per meta call.

**Risk:** Breaks only if a user filterFn stores `addMeta` and invokes it after the loop advances (asynchronous meta). Built-in filterFns never even declare the addMeta param. Must be applied to BOTH loops (131–137 and 151–157), and the sync-only addMeta contract documented, since it narrows a technically public FilterFn API behavior.
**Verification:** CONFIRMED (dead guard proven; both-loops + contract-documentation requirements added).

---

## 79. B12: leafRows eagerly flattened for every group at depth ≥ 1 even if never aggregated — Score: 6

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/features/column-grouping/createGroupedRowModel.ts:115–118` (with `utils.ts:109–128` `flattenBy`)
**Category:** `big-o`, `allocation`

Hot path: Per state-change: every grouped recompute, per group at depth ≥ 1. Each depth≥1 group flattens its whole subtree eagerly: summed over all groups at one depth that is O(R); over G grouping levels, O(R×G) total pushes + one array + one closure per group, paid even when no aggregated cell for that group is ever rendered (virtualized grids render a page; collapsed groups render only visible aggregations). `leafRows` is consumed lazily via the assigned `getValue` and exposed as `row.leafRows` (which has zero in-repo readers, grep-verified; aggregations consume the captured variable).

**Before**

```ts
// Flatten the leaf rows of the rows in this group
const leafRows = depth
  ? flattenBy(groupedRows, (row) => row.subRows)
  : groupedRows
```

**After**

(lazy materialization; the getter MUST be installed with `Object.defineProperty`, not an object-literal accessor inside `Object.assign`, because `Object.assign` invokes source getters and copies values)

```ts
        let _leafRows: Array<Row<TFeatures, TData>> | undefined
        const getLeafRows = () =>
          (_leafRows ??= depth
            ? flattenBy(groupedRows, (r) => r.subRows)
            : groupedRows)

        Object.assign(row, {
          groupingColumnId: columnId,
          groupingValue,
          subRows,
          getValue: (colId: string) => {
            // ...
            if (aggregateFn) {
              row._groupingValuesCache[colId] = aggregateFn(
                colId,
                getLeafRows(),
                groupedRows,
              )
            // ...
          },
        })
        Object.defineProperty(row, 'leafRows', {
          get: getLeafRows,
          set(v) {
            _leafRows = v
          },
          enumerable: true,
          configurable: true,
        })
```

Plus convert `flattenBy` to an iterative loop (see D12).

**Big-O:** O(R×G) flatten work → ~0 when aggregations are not read (collapsed/virtualized); at R=100k, G=3: up to 300k pushes + per-group arrays/closures deferred or avoided per recompute. Worst case unchanged.

**Risk:** `row.leafRows` changes from data property to accessor. Verifier addition: a get-only accessor would make user `row.leafRows = x` assignments throw in strict mode, so include a setter (as above) or materialize on first read. Spread/serialization of grouped rows sees identical values.
**Verification:** AMENDED: `Object.defineProperty` requirement upheld (the finder's own catch), verifier added the setter/strict-mode note and confirmed zero in-repo `row.leafRows` readers.

---

## 80. B15: expandRows re-reads the expanded atom and re-dispatches option lookups once per row — Score: 6

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/features/row-expanding/createExpandedRowModel.ts:61–82` (with `rowExpandingFeature.utils.ts:309–331`)
**Category:** `render-path`, `allocation`

Hot path: Per state-change: expansion toggles walk all visible R rows. Strengthened by the verifier: `paginateExpandedRows` defaults to TRUE (`rowExpandingFeature.ts:39`), so the expanded model runs `expandRows` over all rows per expand change BY DEFAULT; the page-bounded variant is the opt-out. Per branch row: an atom `.get()` (in reactive contexts each get pays tracker registration/dedup), an `?? {}` object allocation when the atom is absent, and two option-chain dispatches. Over R=100k rows that is 100k atom reads + up to 100k throwaway `{}` allocations per expansion recompute. The state cannot change mid-walk; hoist once.

**Before**

```ts
const handleRow = (row: Row<TFeatures, TData>) => {
  expandedRows.push(row)

  if (row.subRows.length && row_getIsExpanded(row)) {
    row.subRows.forEach(handleRow)
  }
}

rowModel.rows.forEach(handleRow)
```

where `row_getIsExpanded` does per call:

```ts
const expanded: ExpandedState = row.table.atoms.expanded?.get() ?? {}

return !!(
  row.table.options.getIsRowExpanded?.(row) ??
  (expanded === true || isExpandedRowId(expanded, row.id))
)
```

**After**

(verifier-amended: pass `table` as an explicit optional parameter to stay API-compatible; `isExpandedRowId` already handles `undefined`, so no hoisted `?? {}` is needed)

```ts
export function expandRows<...>(
  rowModel: RowModel<TFeatures, TData>,
  table?: Table_Internal<TFeatures, TData>,
): RowModel<TFeatures, TData> {
  const expandedRows: Array<Row<TFeatures, TData>> = []
  const tbl = table ?? rowModel.rows[0]?.table
  const expanded = tbl?.atoms.expanded?.get()
  const getIsRowExpanded = tbl?.options.getIsRowExpanded

  const handleRow = (row: Row<TFeatures, TData>) => {
    expandedRows.push(row)

    if (
      row.subRows.length &&
      !!(
        getIsRowExpanded?.(row) ??
        (expanded === true || isExpandedRowId(expanded, row.id))
      )
    ) {
      for (let i = 0; i < row.subRows.length; i++) {
        handleRow(row.subRows[i]!)
      }
    }
  }

  const rows = rowModel.rows
  for (let i = 0; i < rows.length; i++) {
    handleRow(rows[i]!)
  }
  // ...
}
```

Both call sites (`createExpandedRowModel.ts:53`, `createPaginatedRowModel.ts:58`) have the table in scope.

**Big-O:** R atom reads + R `{}` allocations + 2R optional-chain dispatches → 2 reads total; forEach closures → classic loops. ~1-5ms at 100k expanded rows per toggle, on the DEFAULT expanded-model path.

**Risk:** Semantics identical: `row_getIsExpanded` reads only these two sources. A user's `getIsRowExpanded` is still invoked per row.
**Verification:** AMENDED and strengthened: default `paginateExpandedRows: true` makes this the default path; `?? {}` hoist dropped as unnecessary; explicit optional `table` parameter preferred.

---

## 81. D6: assignPrototypeAPIs memoized wrapper: rest/spread + double lookup → single-arg passthrough — Score: 6

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/utils.ts:432–446` (memoized), `utils.ts:449–451` (non-memoized)
**Category:** `micro`, `allocation`

Hot path: Every call to every prototype-assigned API on rows/cells/columns/headers. Cell-level examples: `cell.getContext()` (memoized) runs R×N times per render pass; `column.getIsVisible()` per column per header/visibility build; `row.getIsSelected()` per row per render. The memo target returned by `tableMemo`/`memo` has signature `(depArgs?: TDepArgs) => TResult`: exactly one parameter. Rest-collecting `...args` and re-spreading allocates an args array per call (an empty one for the common zero-arg getters) and forces spread-call machinery; extra args beyond the first are dropped by `memoizedFn` anyway. `this[memoKey]` is also looked up twice.

**Cross-refs / gating:** Skipped entry #2 (perf-skipped.md) rejected an earlier claim against this same wrapper: the two inner arrow closures are lazy per-instance (allocated once inside the init branch), not per-call, so there was no win there. D6 targets the real per-call cost instead: the rest-array allocation, spread call, and double `this[memoKey]` lookup in the wrapper body.

**Before**

```ts
prototype[fnKey] = function (this: any, ...args: Array<any>) {
  // Lazily create memo on first access for this instance
  if (!this[memoKey]) {
    const self = this
    this[memoKey] = tableMemo({
      memoDeps: (depArgs) => memoDeps(self, depArgs),
      fn: (...deps) => fn(self, ...deps),
      fnName,
      objectId: self.id,
      table,
      feature,
    })
  }
  return this[memoKey](...args)
}
```

**After**

```ts
prototype[fnKey] = function (this: any, depArgs?: any) {
  // Lazily create memo on first access for this instance
  let memoFn = this[memoKey]
  if (!memoFn) {
    const self = this
    memoFn = this[memoKey] = tableMemo({
      memoDeps: (dArgs) => memoDeps(self, dArgs),
      fn: (...deps) => fn(self, ...deps),
      fnName,
      objectId: self.id,
      table,
      feature,
    })
  }
  return memoFn(depArgs)
}
```

**Big-O:** Removes one rest-array allocation, one spread call, and one dynamic property lookup per memoized-API invocation. At R×N cell-context calls per render (e.g. 50k rows × 20 cols = 1M calls) that is up to ~1M avoided allocations plus lookups per render pass.

**Risk:** Very low for the memoized wrapper: single-arg is provably equivalent since `memoizedFn` ignores extra args, and `memoizedFn` is an arrow so receiver rebinding via `memoFn(depArgs)` is safe. The NON-memoized wrapper (`function (this, ...args) { return fn(this, ...args) }`, utils.ts:449–451, covering hot fns like `cell_getValue`) could get a fixed-arity passthrough for the same saving, but requires a one-pass audit of static fn signatures (any fn inspecting `arguments.length`); that variant is scored separately at 4.
**Verification:** CONFIRMED (single-parameter memoizedFn and arrow-receiver safety verified; non-memoized variant kept at 4 pending arity audit).

---

## 82. F4: Solid/Vue batch bindings are @tanstack/store batch and cannot coalesce framework-native atoms — Score: 6

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/vue-table/src/reactivity.ts:2,87` and `packages/solid-table/src/reactivity.ts:8,90`
**Category:** `memoization`, `observation`

Hot path: Every multi-atom write core wraps in `_reactivity.batch`: `table_syncExternalStateToBaseAtoms` (runs on EVERY `setOptions`, i.e. every controlled-state sync, per resize tick when sizing is controlled) and `table_reset` (up to 15 writes). In both adapters the writable atoms are framework-native (Vue `shallowRef` with `flush: 'sync'` watchers; Solid `createSignal`). `@tanstack/store`'s `batch` only defers notifications of its OWN atoms (verified: it gates only its internal `flush()`), so Vue sync watchers and Solid signal observers fire immediately per write inside it. Core's batch blocks degrade to N independent notification cascades: `table_reset` with 15 slices triggers up to 15 snapshot recomputes + subscriber cascades instead of 1; each controlled `setOptions` sync with M changed slices triggers M cascades. Solid has a real `batch` in `solid-js`. (Contrast: react/preact/svelte/lit/alpine use `@tanstack/*-store` atoms, so their binding is effective; Angular's `(fn) => fn()` no-op is acceptable because effect-flush delivery naturally coalesces.)

**Before**

```ts
import { batch } from '@tanstack/store'
// ...
      const writableSignal = createSignal(value, { ... })
      return signalToWritableAtom(writableSignal, owner)
    },
    untrack: untrack,
    batch: batch,
```

**After**

(solid, drop-in)

```ts
import { batch as solidBatch } from 'solid-js'
// ...
batch: solidBatch,
```

Vue: design-level, not a mechanical fix; back the writable atoms' subscribe with a queue that `batch` flushes, or accept per-write delivery. `flush: 'sync'` was chosen so table APIs read consistent state immediately after a write; any deferral must still flush before core reads derived atoms synchronously.

**Big-O:** `table_reset`: 15 cascades → 1 (Solid). Controlled-state `setOptions` sync per tick with 2 changed slices: 2 cascades → 1. Each avoided cascade = one snapshot rebuild (15 atom reads + object alloc) + S subscriber selector runs.

**Risk:** Solid change is drop-in (solid batch is the canonical multi-write primitive). Vue portion flagged for careful design.
**Verification:** CONFIRMED (store batch scope, core batch sites, and Angular's coalescing all re-verified).

---

## 84. F10: React createTableHook AppCell/AppHeader/AppFooter allocate a spread temp object per cell per render — Score: 6

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/react-table/src/createTableHook.tsx:1045–1048` (AppCell), `:1121–1124` (AppHeader), `:1201–1204` (AppFooter)
**Category:** `allocation`

Hot path: Per cell/header per render of every AppCell/AppHeader usage; whole-grid renders per resize tick in default subscription mode → R_vis×N executions. The second argument is a brand-new object with |cellComponents|+1 keys allocated on every render of every cell, only to be copied onto the (stable, core-memoized) cell instance again. Both `CellFlexRender` and `cellComponents` are fixed for the lifetime of the hook (factory-scope stable, verified at lines 693-924); the source object can be hoisted to the `createTableHook` closure. Same pattern ×3.

**Before**

```ts
const extendedCell = Object.assign(cell, {
  FlexRender: CellFlexRender,
  ...cellComponents,
})
```

**After**

```ts
// once, in createTableHook scope:
const boundCellComponents = { FlexRender: CellFlexRender, ...cellComponents }
const boundHeaderComponents = {
  FlexRender: HeaderFlexRender,
  ...headerComponents,
}
const boundFooterComponents = {
  FlexRender: FooterFlexRender,
  ...headerComponents,
}
// per render:
const extendedCell = Object.assign(cell, boundCellComponents)
```

**Big-O:** −R_vis×N object allocations (each |components|+1 keys) per render; worst case −50k allocs per tick-driven render. The `Object.assign` writes remain (cells can be recreated by core), but source-object construction drops to zero.

**Risk:** None observable: same keys, same values, same assignment onto the instance. `FooterFlexRender` needs its own bound object. Scope note: only affects `createTableHook` App-component consumers.
**Verification:** CONFIRMED (factory-scope stability of all three FlexRenders and component maps verified).

---

## Score 5

## 3. `memo()` debug timing locals always allocated (broadened by D3: tableMemo prod fast path) — Score: 5

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/utils.ts:200–207` (memo timing locals); `src/utils.ts:213–339` (`tableMemo`), interacting with `src/utils.ts:157–169` (per-call callback checks)
**Category:** `micro`, `allocation`, `bundle-size`

`beforeCompareTime`, `afterCompareTime`, `startCalcTime`, `endCalcTime` are allocated even in prod. Move them inside the `if (process.env.NODE_ENV === 'development')` branch. Bundlers eliminate the dev branch entirely in prod.

**2026-07-01 audit (D3, score 5) — broadened to the full `tableMemo` prod fast path.** `tableMemo` runs once per table API at construct AND once per instance-API on first call of every lazily memoized row/cell/column/header method (10^5–10^6 invocations during first render/scroll at R=100k, upper bound). Only 4 call sites pass `onAfterUpdate` (createCoreRowModel:28, createSortedRowModel:35, createFilteredRowModel:44, createGroupedRowModel:42; all table-level, constructed once). Yet every per-instance lazy memo init in prod allocates the `onAfterUpdateHandler` closure, the `debugOptions` object, its arrow, and the `{...memoOptions, ...debugOptions}` spread object, plus `logTime` unless the minifier DCEs it. Because prod always installs `onAfterUpdate`, `memo` cannot take a lean path and the optional-callback checks (`onBeforeCompare?.()`/`onAfterCompare?.()`) branch on every memoized call.

**After (D3 proposal)**

```ts
if (process.env.NODE_ENV !== 'development' && !onAfterUpdate) {
  // Prod fast path: no debug hooks, no scheduling handler needed.
  return memo(memoOptions)
}
```

placed before the `logTime` declaration (and move `logTime` inside the dev scope so it is guard-eliminated without relying on minifier DCE). The 4 row-model memos with `onAfterUpdate` keep the existing wrapper path.

**Big-O:** Eliminates ~4–5 heap allocations plus one object spread per lazy memo init (10^5–10^6 during first paint at R=100k, upper bound) and, via absent callbacks, two optional-call branches per memoized invocation at R×N per render.

**Risk:** Low. Functional parity: an absent `onAfterUpdate` meant the prod handler was a guaranteed no-op. Dev branch intact, so `debugCache`/`debugAll` behavior unchanged.
**Verification:** CONFIRMED (4 call sites and the always-installed prod handler verified; init-count figure treated as an upper bound).

---

## 27. `globallyFilterableColumns` computed even when `globalFilter` is empty — Score: 5

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/column-filtering/createFilteredRowModel.ts:95–110`
**Category:** `micro`, `big-o` (short-circuit)

The `.getAllLeafColumns().filter(column_getCanGlobalFilter)` pass runs on _every_ filtered-row-model build, even when no global filter is active. Gate the entire branch.

**Before**

```ts
const filterableIds = columnFilters?.map((d) => d.id) ?? []

const globalFilterFn = table_getGlobalFilterFn(table)

const globallyFilterableColumns = table
  .getAllLeafColumns()
  .filter((column) => column_getCanGlobalFilter(column))

if (globalFilter && globalFilterFn && globallyFilterableColumns.length) {
  filterableIds.push('__global__')

  globallyFilterableColumns.forEach((column) => {
    resolvedGlobalFilters.push({
      id: column.id,
      filterFn: globalFilterFn,
      resolvedValue:
        globalFilterFn.resolveFilterValue?.(globalFilter) ?? globalFilter,
    })
  })
}
```

**After**

```ts
if (globalFilter && globalFilterFn) {
  const globallyFilterableColumns = table
    .getAllLeafColumns()
    .filter((column) => column_getCanGlobalFilter(column))
  if (globallyFilterableColumns.length) {
    filterableIds.push('__global__')
    ...
  }
}
```

**Big-O:** Saves O(C) work + O(C) `column_getCanGlobalFilter` invocations per filtered row-model rebuild when no global filter is active (the common case).

**Scale impact** (work saved per filtered-row-model rebuild, **no global filter active**):

| Cols (C) | Rebuilds | Before (C × rebuilds) `column_getCanGlobalFilter` calls | After | Saved     |
| -------- | -------- | ------------------------------------------------------- | ----- | --------- |
| 10       | 10       | 100                                                     | 0     | 100       |
| 50       | 100      | 5,000                                                   | 0     | 5,000     |
| 100      | 1,000    | 100,000                                                 | 0     | 100,000   |
| 500      | 10,000   | 5,000,000                                               | 0     | 5,000,000 |

**Risk:** None.

**2026-07-01 audit (B3, score 5 — re-verified, amends the sketch above):** Gate the whole branch on `globalFilter` first (skipping the `table_getGlobalFilterFn` resolution too, where `column_getCanGlobalFilter` does ~5 option/def reads plus an optional user callback per column), and additionally hoist `resolveFilterValue` out of the per-column loop: lines 106–107 currently recompute the identical resolved filter value once per globally filterable column (N `resolveFilterValue` calls instead of 1).

**After (amended)**

```ts
if (globalFilter) {
  const globalFilterFn = table_getGlobalFilterFn(table)

  const globallyFilterableColumns = table
    .getAllLeafColumns()
    .filter((column) => column_getCanGlobalFilter(column))

  if (globalFilterFn && globallyFilterableColumns.length) {
    filterableIds.push('__global__')

    const resolvedGlobalFilterValue =
      globalFilterFn.resolveFilterValue?.(globalFilter) ?? globalFilter

    globallyFilterableColumns.forEach((column) => {
      resolvedGlobalFilters.push({
        id: column.id,
        filterFn: globalFilterFn,
        resolvedValue: resolvedGlobalFilterValue,
      })
    })
  }
}
```

**Big-O (amended):** O(N) → O(1) when globalFilter is empty; N−1 `resolveFilterValue` calls saved when active. At N=500, F=2 column filters: 500 predicate calls + 1 array alloc per keystroke removed.

**Risk (amended):** None functional; `resolveFilterValue` receives the same value in all N calls today, so hoisting is behavior-identical for pure fns (impure fns already unsupported). Composes with #73 (E1): this hoist keeps the new resolveFilterValue at 1 call instead of N.
**Verification:** CONFIRMED (2026-07-01 audit).

---

## 33. Per-row aggregated `column_getAggregationFn` resolution — Score: 5

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/column-grouping/createGroupedRowModel.ts:159–161`
**Category:** `memoization`

Inside the grouped row's `getValue`, every non-grouped column lookup calls `table.getColumn(colId)` and `column_getAggregationFn(column)`. The result depends only on `colId` (effectively). Cache aggregation results per `(row, colId)` via a `_aggregationCache` on the row.

**Scale impact** (aggregation invocations saved on repeat cell reads — dimension: grouped rows × non-grouped cols × repeat reads):

| Grouped rows | Non-grouped cols | Repeat reads/cell | Before (re-aggregate each read) | After (1 per cell, then cache hits) | Saved aggregations |
| ------------ | ---------------- | ----------------- | ------------------------------- | ----------------------------------- | ------------------ |
| 10           | 5                | 2                 | 100                             | 50                                  | 50                 |
| 100          | 20               | 5                 | 10,000                          | 2,000                               | 8,000              |
| 1,000        | 50               | 10                | 500,000                         | 50,000                              | 450,000            |
| 10,000       | 100              | 10                | 10,000,000                      | 1,000,000                           | 9,000,000          |

**Risk:** Already cached implicitly via `_groupingValuesCache`. Verify cache-key collision doesn't occur if extending it.

---

## 40. `table_getIsAllColumnsVisible` / `getIsSomeColumnsVisible` not memoized — Score: 5

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/column-visibility/columnVisibilityFeature.ts:131–140`
**Category:** `memoization`

Called by toolbar checkboxes on every render. `.some()` walks all leaf columns each call.

```ts
table_getIsAllColumnsVisible: {
  fn: () => table_getIsAllColumnsVisible(table),
  memoDeps: () => [table.atoms.columnVisibility?.get(), table.options.columns],
},
table_getIsSomeColumnsVisible: {
  fn: () => table_getIsSomeColumnsVisible(table),
  memoDeps: () => [table.atoms.columnVisibility?.get(), table.options.columns],
},
```

**Big-O:** O(C) per call → O(1) until visibility changes.

**Scale impact** (`.some()` walks saved per render — dimension: renders × leaf cols):

| Renders × Cols | Walks before | After (steady state) | Saved     |
| -------------- | ------------ | -------------------- | --------- |
| 10 × 10        | 100          | 0                    | 100       |
| 100 × 50       | 5,000        | 0                    | 5,000     |
| 1,000 × 100    | 100,000      | 0                    | 100,000   |
| 10,000 × 500   | 5,000,000    | 0                    | 5,000,000 |

**Risk:** None.

**2026-07-01 audit (C14, score 5 — complete deps proposal):** Use `memoDeps: () => [table.atoms.columnVisibility?.get(), table.getAllLeafColumns()]` rather than `table.options.columns`. Transitive-coverage proof: deps are complete for leaf columns — `column.columns` is empty for leaves, so no recursion; column set/order changes are covered by the `getAllLeafColumns()` array identity (which itself keys on columns/columnOrder/grouping/groupedColumnMode). Each un-memoized call today walks all N leaf columns via `callMemoOrStaticFn(column, 'getIsVisible', ...)`, each running a memoDeps closure allocating a 3-element array: at N=500 that is 500 memo invocations + 500 deps-array allocations per render per getter. Typical N is 10–50 and the getters only run when visibility-menu UI is rendered; the score stands on the N=500 tail. Same root-cause family as #90 (C3): per-column `getIsVisible` fan-out.
**Verification:** CONFIRMED (deps completeness verified for leaf columns).

---

## 41. `getColumnCanGlobalFilter` default re-evaluates row[0] cell per column per call — Score: 5

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/global-filtering/globalFilteringFeature.ts:55–63`
**Category:** `memoization`

Default `getColumnCanGlobalFilter` reads `flatRows[0].getAllCellsByColumnId()[column.id].getValue()` every call. Called once per column when computing globally-filterable columns; with 50 columns that's 50 row[0]-cell rebuilds per filter pass. Memoize across calls keyed on `getCoreRowModel()`.

**Before**

```ts
getColumnCanGlobalFilter: (column) => {
  const value = table
    .getCoreRowModel()
    .flatRows[0]?.getAllCellsByColumnId()
    [column.id]?.getValue()
  return typeof value === 'string' || typeof value === 'number'
}
```

**After (closure-captured cache)**

```ts
let cachedFor: any = undefined
let cache: Map<string, boolean> | undefined
return {
  getColumnCanGlobalFilter: (column) => {
    const coreRowModel = table.getCoreRowModel()
    if (cachedFor !== coreRowModel) {
      cachedFor = coreRowModel
      cache = new Map()
      const cells = coreRowModel.flatRows[0]?.getAllCellsByColumnId()
      if (cells)
        for (const id in cells) {
          const v = cells[id]?.getValue?.()
          cache.set(id, typeof v === 'string' || typeof v === 'number')
        }
    }
    return cache!.get(column.id) ?? false
  },
}
```

**Big-O:** O(C) row-zero cell rebuilds per filter pass → O(C) total, amortized O(1) per column lookup.

**Scale impact** (row[0] cell-collection rebuilds saved — dimension: cols × filter passes):

| Cols (C) | Filter passes (F) | Before (C × F rebuilds) | After (≤ F rebuilds) | Saved     |
| -------- | ----------------- | ----------------------- | -------------------- | --------- |
| 10       | 10                | 100                     | 10                   | 90        |
| 50       | 100               | 5,000                   | 100                  | 4,900     |
| 100      | 1,000             | 100,000                 | 1,000                | 99,000    |
| 500      | 10,000            | 5,000,000               | 10,000               | 4,990,000 |

**Risk:** None. Cache invalidates whenever core row model identity changes.

---

## 85. A6: Missing empty-pinning short-circuits in center-partition functions — Score: 5

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts:189–202` (row_getCenterVisibleCells), `:738–746` (table_getCenterLeafColumns), `:430–450` (table_getCenterHeaderGroups)
**Category:** `big-o` (short-circuit), `allocation`

Hot path: per state-change recompute (pinning/visibility/order/columns) × R rows for the row variant; the vast majority of tables have EMPTY pinning yet still pay the copy. The siblings `row_getLeftVisibleCells`/`row_getRightVisibleCells` already have the empty fast path (`if (!left.length) return []`, lines 221/257); the center variants do not. With no pinning (the default), every recompute still allocates the spread array plus a filtered COPY of all N cells per row, and returns a new array identity where returning `allCells` directly would preserve reference equality for downstream consumers. `.includes` over the tiny `leftAndRight` is fine per doctrine; the issue is only the missing short-circuit and the copies.

**Cross-refs / gating:** Skipped entry #36 (perf-skipped.md) deliberately rejected the Set conversion for the tiny `[...left, ...right]` arrays; that decision stands. This entry is the doctrine-compliant alternative: the empty-pinning short-circuit plus identity preservation, which needs no data-structure change.

**Before**

```ts
const allCells = callMemoOrStaticFn(row, 'getVisibleCells', row_getVisibleCells)
const { left, right } =
  row.table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
const leftAndRight: Array<string> = [...left, ...right]
return allCells.filter((d) => !leftAndRight.includes(d.column.id))
```

(the other two use the identical `[...left, ...right]` + `.filter` shape)

**After**

```ts
const { left, right } =
  row.table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
const allCells = callMemoOrStaticFn(row, 'getVisibleCells', row_getVisibleCells)
if (!left.length && !right.length) {
  return allCells
}
const leftAndRight: Array<string> = [...left, ...right]
return allCells.filter((d) => !leftAndRight.includes(d.column.id))
```

For `table_getCenterLeafColumns`: `if (!left.length && !right.length) return table.getAllLeafColumns()`. For `table_getCenterHeaderGroups`: skip the spread+filter when both are empty and pass `leafColumns` straight to `buildHeaderGroups`.

**Big-O:** In the unpinned case: O(N) filter copy + spread per recompute → O(1). Row variant: R × (1 array alloc + N includes-checks + N-element copy) per pinning-adjacent state change eliminated. Referential identity of `allCells` preserved, so downstream dep tuples keyed on the cells array stop invalidating spuriously.

**Risk:** Very low. Returning the shared array matches the `table_getPinnedVisibleLeafColumns(table, undefined)` precedent; `buildHeaderGroups` does not mutate `columnsToGroup` (verified: it only `.map`s it); no in-repo mutation of the returned arrays.
**Verification:** CONFIRMED, demoted 6 → 5 (fires only for pinning-layout tables that happen to have empty pinning; per state-change, not per tick).

---

## 86. A11: buildHeaderGroups findMaxDepth: skip getIsVisible on leaf columns — Score: 5

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts:362–383, 396–417` (left/right header groups); cost source `packages/table-core/src/core/headers/buildHeaderGroups.ts:32–50, 129–136`
**Category:** `big-o` (short-circuit)

Hot path: per state-change (columnOrder / pinning / visibility / columns). In the default unpinned table, the left AND right variants both run full `buildHeaderGroups` on every such change, producing structurally empty groups. Current code: `findMaxDepth` consults the memoized `getIsVisible` on EVERY column node (leaves included) before checking whether the node has children. When a pinning region is empty (the default), `buildHeaderGroups` still runs `findMaxDepth` over ALL columns: O(total column nodes) with a memoized `getIsVisible` consult per node (N=500, D=3 → ~650+ memo dep-evals), then constructs D empty header-group objects. Twice (left + right) per invalidation. Leaf columns never deepen the tree, so their visibility consult is pure waste. Shrinking `findMaxDepth` to consult visibility only for GROUP columns cuts the walk from O(all nodes × memo-consult) to O(group nodes × memo-consult) for every `buildHeaderGroups` call, empty regions included.

**After**

```ts
let maxDepth = 0

const findMaxDepth = (
  columns: Array<Column<TFeatures, TData, TValue>>,
  depth = 1,
) => {
  maxDepth = Math.max(maxDepth, depth)

  for (let i = 0; i < columns.length; i++) {
    const column = columns[i]!
    if (column.columns.length) {
      if (callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible)) {
        findMaxDepth(column.columns, depth + 1)
      }
    }
  }
}
```

**Big-O:** Per pinning/order/visibility state-change: 2 × O(N·D) memo consults → 2 × O(group-count). Flat tables (no groups): the entire visibility walk disappears (~500 memo consults → ~5 at N=500).

**Risk:** Low but subtle: the current code calls `getIsVisible` on leaf columns yet ignores the result for depth purposes; reordering the checks provably preserves `maxDepth` (leaf visibility can never extend depth; hidden group subtrees are skipped in both versions). Benefits all `buildHeaderGroups` callers (center/core paths too). Ship as part of the coordinated buildHeaderGroups work item together with D8/D9/D10/D11 (one review, one snapshot-test harness for header ids/spans).
**Verification:** CONFIRMED (check-reorder equivalence proven).

---

## 87. B7: from-leafs filter constructs a clone row for every row, including discarded leaves — Score: 5

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/features/column-filtering/filterRowsUtils.ts:54–91`
**Category:** `allocation`

Hot path: per state-change: every filter recompute with `filterFromLeafRows: true` (opt-in). `constructRow` (row object + 2 null-proto maps + feature-init loop) runs for EVERY input row before the filter verdict is known. Leaf rows that fail are constructed then discarded; leaf rows that pass did not need a clone at all; the sibling `filterRowModelFromRoot` pushes original leaf rows directly and only clones rows whose `subRows` must be replaced. At R=100k mostly-leaf data with a selective filter: ~100k wasted `constructRow` calls (+200k map allocs + feature loops) per keystroke.

**Cross-refs / gating:** Pre-existing behavior recorded during verification: the current from-leafs clone copies only `columnFilters` and silently drops `columnFiltersMeta` (filterRowsUtils.ts:65). This fix would incidentally change (preserve) that; it must be a deliberate, documented decision either way.

**Before**

```ts
    for (let row of rowsToFilter) {
      const newRow = constructRow(
        table,
        row.id,
        row.original,
        row.index,
        row.depth,
        undefined,
        row.parentId,
      ) as Row<TFeatures, TData> &
        Partial<Row_ColumnFiltering<TFeatures, TData>>
      newRow.columnFilters = row.columnFilters

      if (row.subRows.length && depth < maxDepth) {
        // ...
      } else {
        row = newRow
        if (filterRow(row)) {
          filteredRows.push(row)
```

**After**

```ts
for (let row of rowsToFilter) {
  if (row.subRows.length && depth < maxDepth) {
    const newRow = constructRow(
      table,
      row.id,
      row.original,
      row.index,
      row.depth,
      undefined,
      row.parentId,
    ) as Row<TFeatures, TData> & Partial<Row_ColumnFiltering<TFeatures, TData>>
    newRow.columnFilters = row.columnFilters
    newRow.subRows = recurseFilterRows(row.subRows, depth + 1)
    row = newRow

    if (newRow.subRows.length || filterRow(row)) {
      filteredRows.push(row)
      newFilteredRowsById[row.id] = row
      newFilteredFlatRows.push(row)
    }
  } else if (filterRow(row)) {
    filteredRows.push(row)
    newFilteredRowsById[row.id] = row
    newFilteredFlatRows.push(row)
  }
}
```

**Big-O:** constructRow calls drop from O(R) to O(branch rows). At 100k rows / 10k branch rows: ~90k row constructions, ~180k map allocations, ~90k feature-init loops saved per filter recompute.

**Risk (verifier-amended: THREE behavior deltas, not one):** (1) leaf rows in the filtered model become the ORIGINAL row objects instead of clones (disclosed by finder; matches `filterRowModelFromRoot`); (2) `columnFiltersMeta` is now PRESERVED on those rows, where the current clone copies only `columnFilters` and silently drops meta (see the correctness section's from-leafs meta-loss note); (3) rows at `depth >= maxDepth` that have subRows keep their original subRows instead of a truncated clone. All three converge on `filterRowModelFromRoot`'s existing behavior, so they are defensible, but all three must be listed in the change.
**Verification:** AMENDED, 6 → 5: two additional behavior deltas identified (meta preservation, maxDepth subRows) beyond the disclosed leaf-identity delta.

---

## 90. C3: row_getVisibleCells: O(N) per-cell memoized getIsVisible calls per row instead of the table-level visible-column list — Score: 5

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts:146–190` (registration `columnVisibilityFeature.ts:66–73`)
**Category:** `render-path`

Hot path: per rendered row, on every render after a `columnVisibility` or `columnPinning` change (memoDeps invalidate all rows at once). Rendered rows × N leaf columns. Each of the N calls goes through `callMemoOrStaticFn` → the column's per-instance memo → its `memoDeps` closure, which allocates a 3-element deps array and compares it, per column per row. After a visibility change, a render of 100 rows × 500 columns = 50,000 memo-compare invocations + 50,000 deps-array allocations, re-deriving a fact already memoized once at table level (`table_getVisibleLeafColumns`).

**Cross-refs / gating:** The correctness gate filed with this finding (the `table_getVisibleLeafColumns` memoDeps fix, A2) has since been DELIVERED in PR #6367 (perf-done.md #67), so the deps gate is satisfied; only the restructure remains, including the companion `row_getVisibleCellsByColumnId` restructure required for the headline metric.

**Before**

```ts
const allCells = row.getAllCells()
const visibleCells: Array<Cell<TFeatures, TData, unknown>> = []
for (let i = 0; i < allCells.length; i++) {
  const cell = allCells[i]!
  if (callMemoOrStaticFn(cell.column, 'getIsVisible', column_getIsVisible)) {
    visibleCells.push(cell)
  }
}
```

**After**

```ts
const visibleColumns = row.table.getVisibleLeafColumns()
const visibleCellsByColumnId = callMemoOrStaticFn(
  row,
  'getVisibleCellsByColumnId',
  row_getVisibleCellsByColumnId,
)
const visibleCells: Array<Cell<TFeatures, TData, unknown>> = []
for (let i = 0; i < visibleColumns.length; i++) {
  const cell = visibleCellsByColumnId[visibleColumns[i]!.id]
  if (cell) visibleCells.push(cell)
}
```

with registration memoDeps enumerating the new inputs: `(row) => [row.getAllCells(), table.atoms.columnPinning?.get(), table.atoms.columnVisibility?.get(), table.getVisibleLeafColumns()]`.

**Big-O (verifier-relocated):** As filed, the claimed rows×N → rows×V collapse does NOT materialize on visibility changes: the per-column `getIsVisible` fan-out relocates into `row_getVisibleCellsByColumnId`, which runs the identical per-cell memo loop. The full win requires the companion restructure of `row_getVisibleCellsByColumnId` to build from `table.getVisibleLeafColumns()` × `row.getAllCellsByColumnId()`. As proposed, the win is real for pinning-change recomputes (N memo-compares → V lookups) and dedupe in the pinned case; with the companion restructure, the 50k memo calls/allocs collapse to one table-level memo check + rows×V map lookups.

**Risk:** Ordering equivalence holds (`getVisibleLeafColumns` filters `getAllLeafColumns`, the same order that built `getAllCells`). **Correctness gate satisfied:** the A2 `table_getVisibleLeafColumns` memoDeps fix (previously `[columnVisibility, columnOrder, columns]`, omitting `grouping`/`groupedColumnMode`) shipped in PR #6367 (perf-done.md #67), so routing render-path cells through it no longer extends the pre-existing staleness bug. Duplicate-column-id behavior delta stands as noted.
**Verification:** AMENDED: metric relocation caveat added (companion `row_getVisibleCellsByColumnId` restructure required for the headline claim); the `getVisibleLeafColumns` deps gate is now satisfied (PR #6367, perf-done.md #67); 6-7 reachable with both amendments, 5 as filed.

---

## 91. C8: isSubRowSelected recursion recomputes descendant subtrees instead of reusing per-row memos — Score: 5

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts:782–824` (registrations `rowSelectionFeature.ts:62–77`)
**Category:** `memoization`

Hot path: per rendered parent row per render after any selection change (indeterminate checkbox UI). `row_getIsSomeSelected` and `row_getIsAllSubRowsSelected` are each memoized per row, but the nested call at line 811 bypasses memoization. For a tree, a depth-0 parent's `getIsSomeSelected` re-walks its ENTIRE subtree statically, even though each child row has its own memoized getters holding the same answer: O(R×depth) selection checks per selection change instead of O(R). A checkbox reading both `getIsSomeSelected` AND `getIsAllSubRowsSelected` (the standard indeterminate pattern) walks every subtree twice.

**Before**

```ts
    // Check row selection of nested subrows
    if (subRow.subRows.length) {
      const subRowChildrenSelected = isSubRowSelected(subRow)
```

**After** (reconstruct the child's tri-state from its two memoized booleans)

```ts
    if (subRow.subRows.length) {
      const subAll = callMemoOrStaticFn(
        subRow,
        'getIsAllSubRowsSelected',
        row_getIsAllSubRowsSelected,
      )
      const subRowChildrenSelected = subAll
        ? 'all'
        : callMemoOrStaticFn(subRow, 'getIsSomeSelected', row_getIsSomeSelected)
          ? 'some'
          : false
```

**Big-O:** Aggregate per selection change across a rendered expanded tree: O(R×depth) → O(R); twin-getter usage: 2 full walks per parent → shared child caches. For a 3-level tree of 10k rows: ~30k+ selection probes → ~10k.

**Risk:** Tri-state bijection verified exactly by the verifier (`getIsAllSubRowsSelected ⇔ 'all'`, `getIsSomeSelected ⇔ 'some'`; both the direct recursion and the memoized getters run the same `row_getCanSelect`-consulting code). Child memoDeps `[subRow.subRows, rowSelection, enableRowSelection]` are the exact recursion inputs; deep-descendant identity is covered because whole-model rebuilds replace all subRows arrays, and that staleness class already exists for direct getter calls. The `callMemoOrStaticFn` `??` fallback is safe (booleans, never nullish). Flat data unaffected (existing early bail preserved).
**Verification:** CONFIRMED (tri-state bijection and deps identity proven).

---

## 92. C11: row_getAllCells reconstructs all cell instances whenever leaf-column array identity changes: per-row cell cache keyed by column instance (WeakMap REQUIRED) — Score: 5

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/core/rows/coreRowsFeature.utils.ts:167–179` + registration `coreRowsFeature.ts:26–29`
**Category:** `allocation`

Hot path: per rendered row after any `columnOrder`, `grouping`, `groupedColumnMode`, or `columns` change: `getAllLeafColumns` memoDeps invalidate on all four, cascading into `row_getAllCells` (dep `[row.table.getAllLeafColumns()]`), then `row_getVisibleCells`, `row_getAllCellsByColumnId`, and `cell_getContext` (new instances → new context objects and closures). Reordering columns (drag) or toggling grouping does not change any (row, column) pair, yet every rendered row rebuilds N cell objects; each cell later rebuilds its context (1 object + 2 closures + a lazy tableMemo per instance). At 100 rendered rows × 100 columns per drag step: ~10k cells + ~10k contexts + ~20k closures churned, and all cell identities change, defeating adapter-level cell memoization (full DOM-level cell re-render). Column instances are stable across order/grouping changes (`getAllColumns` deps are `[options.columns]` only; ordering reorders existing instances), so instance-keyed reuse works.

**Cross-refs / gating:** WeakMap is REQUIRED, not optional (see risk). Legacy entry #20 (perf-todo.md) records the underlying observation this rationale depends on: `createCoreRowModel` memoDeps are `[table.options.data]` only, so rows survive `columns` swaps.

**Before**

```ts
const columns = row.table.getAllLeafColumns()
const cells: Array<Cell<TFeatures, TData, unknown>> = new Array(columns.length)
for (let i = 0; i < columns.length; i++) {
  cells[i] = constructCell(columns[i]!, row, row.table)
}
return cells
```

**After** (verifier-corrected: MUST be a `WeakMap`, not a `Map`)

```ts
const columns = row.table.getAllLeafColumns()
let cache = row._cellsCache
if (!cache) {
  cache = row._cellsCache = new WeakMap<
    Column<TFeatures, TData, unknown>,
    Cell<TFeatures, TData, unknown>
  >()
}
const cells: Array<Cell<TFeatures, TData, unknown>> = new Array(columns.length)
for (let i = 0; i < columns.length; i++) {
  const column = columns[i]!
  let cell = cache.get(column)
  if (!cell) {
    cell = constructCell(column, row, row.table)
    cache.set(column, cell)
  }
  cells[i] = cell
}
return cells
```

**Big-O:** Column reorder / grouping toggle: rendered-rows × N cell constructions + context/memo churn → 0 reconstructions (array reorder only); preserves cell identity so adapter cell memoization survives reorders. Steady-state renders unchanged (the outer memo still short-circuits).

**Risk (WeakMap rationale):** The finder's claim "rows are rebuilt on data/columns change" is FALSE for columns: `createCoreRowModel` memoDeps are `[table.options.data]` ONLY, so rows survive a `columns` swap. A plain `Map` would accumulate one generation of stale column→cell entries per columns-identity change; with the common user error of unstable `columns` per render, that is an unbounded R×N leak. `WeakMap` ephemeron semantics collect the circular key→cell→column entries once old column instances are unreachable. Cells hold only `column`/`id`/`row` + shared prototype (verified); no fresh-cell assumption found in scope. Behavior delta to flag: cell identity now survives leaf-array changes (an adapter memoization win).
**Verification:** AMENDED: WeakMap made mandatory, with the createCoreRowModel-deps rationale (`[data]` only; rows survive columns swaps).

---

## 93. D8: buildHeaderGroups placeholderId computes an O(P) allocating filter per header, O(N²) worst case per level — Score: 5

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/core/headers/buildHeaderGroups.ts:97–107`
**Category:** `big-o`, `allocation`

Hot path: header group build; triggered by every columnVisibility / columnOrder / columnPinning / grouping state change, once per depth level per build. For wide flat tables with any grouped column (D ≥ 2), most leaf columns become placeholders at every upper level (verified: `column.depth !== headerGroup.depth` → placeholder per leaf per upper level), so `pendingParentHeaders.filter(...)` runs per header over a pending array growing toward N: O(N²) comparisons per level plus one throwaway array per placeholder header. At N=500, D=4: up to ~250k comparisons × 3 levels plus ~1.5k array allocations per build.

**Before**

```ts
const header = constructHeader(table, column, {
  id: [headerFamily, depth, column.id, headerToGroup.id]
    .filter(Boolean)
    .join('_'),
  isPlaceholder,
  placeholderId: isPlaceholder
    ? `${pendingParentHeaders.filter((d) => d.column === column).length}`
    : undefined,
  depth,
  index: pendingParentHeaders.length,
})
```

**After**

```ts
        let placeholderCount = 0
        if (isPlaceholder) {
          for (let j = 0; j < pendingParentHeaders.length; j++) {
            if (pendingParentHeaders[j]!.column === column) {
              placeholderCount++
            }
          }
        }

        const header = constructHeader(table, column, {
          id: /* see D9 */,
          isPlaceholder,
          placeholderId: isPlaceholder ? `${placeholderCount}` : undefined,
          depth,
          index: pendingParentHeaders.length,
        })
```

(allocation-free; if the O(N²) itself proves measurable, maintain a per-level `Map<Column, number>` count, doctrine-compliant since column count scales with N.)

**Big-O:** Removes one array allocation + closure per placeholder header per build (~N × (D-1) allocations); the Map variant drops per-level comparisons from O(N²) to O(N). Per-state-change path, not per tick.

**Risk:** Count-loop version is semantically identical (same count, same ordering); the Map variant must key on the column object reference exactly as the `===` filter does. Ship inside the coordinated buildHeaderGroups work item (with A11, D9, D10, D11).
**Verification:** CONFIRMED (O(N²)-per-level case re-derived).

---

## 96. E8: cell_getIsAggregated / cell_getIsPlaceholder recompute column_getIsGrouped up to 3× per cell: boolean-algebra collapse — Score: 5

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts:305–356` (registered without memoDeps at `columnGroupingFeature.ts:51–63`)
**Category:** `render-path`

Hot path: per visible cell per render: grouping UIs call all three predicates on every cell (visibleRows × N calls per render/scroll frame). `cell_getIsAggregated` evaluates `cell_getIsGrouped` twice (once directly, once inside `cell_getIsPlaceholder`) plus `column_getIsGrouped` a third time: 3 atom `.get()` reads + 3 `.includes` scans + repeated property walks per cell, per render. Boolean algebra collapses them: with G = grouped-cell (colG ∧ M where M is `cell.column.id === row.groupingColumnId`), P = placeholder: `!G && !P ≡ !colG`, and `P ≡ colG && !M`.

**Before**

```ts
export function cell_getIsPlaceholder<...>(cell: Cell<TFeatures, TData, TValue>) {
  return !cell_getIsGrouped(cell) && column_getIsGrouped(cell.column)
}

export function cell_getIsAggregated<...>(cell: Cell<TFeatures, TData, TValue>) {
  return (
    !cell_getIsGrouped(cell) &&
    !cell_getIsPlaceholder(cell) &&
    !!cell.row.subRows.length
  )
}
```

**After**

```ts
export function cell_getIsPlaceholder<...>(cell: Cell<TFeatures, TData, TValue>) {
  const row = cell.row as Row<TFeatures, TData> & Partial<Row_ColumnGrouping>
  return (
    column_getIsGrouped(cell.column) && cell.column.id !== row.groupingColumnId
  )
}

export function cell_getIsAggregated<...>(cell: Cell<TFeatures, TData, TValue>) {
  return !column_getIsGrouped(cell.column) && !!cell.row.subRows.length
}
```

**Big-O:** Atom reads + includes per `getIsAggregated` call: 3 → 1; per full cell sweep (all three predicates): 6 → 3. Per render at 50 visible rows × 20 columns: ~3000 fewer atom reads/array scans.

**Risk:** Low. Equivalence proven from source by the verifier, including rows with `groupingColumnId === undefined`. The predicates are un-memoized statics, so the reduction is real render-path work. Predicate unit tests should confirm.
**Verification:** CONFIRMED (equivalence proof completed by verifier).

---

## 97. F5: All 8 adapters: drop the redundant `(prev) => ({...prev, ...options})` pre-merge — Score: 5

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:**

- `packages/react-table/src/useTable.ts:176–179` (per render)
- `packages/preact-table/src/useTable.ts:147–150` (per render)
- `packages/angular-table/src/injectTable.ts:128–133` (per options-effect run)
- `packages/lit-table/src/TableController.ts:177–180` (per host render)
- `packages/alpine-table/src/createTable.ts:82–85` (per effect run)
- `packages/svelte-table/src/createTable.svelte.ts:117–121` (`flatMerge(prev, mergedOptions)`, per `$effect.pre` run)
- `packages/vue-table/src/useTable.ts:89–92` (`flatMerge(prev, ...)`, per watch fire)
- `packages/solid-table/src/createTable.ts:100–104` (`mergeProps(prev, mergedOptions)`, per computed run)

**Category:** `allocation`

Hot path: React/Preact: every component render (per tick during resize in default subscription mode). Others: every reactive option/controlled-state change (per tick when sizing is controlled). `table_setOptions` already merges the updater result with the current options (both the fast path and the `mergeOptions` path re-apply keys from `prev` inside core), so spreading `prev` in the updater is a wholly redundant O(K) object allocation and copy (K ≈ 30-60 option keys) per render/sync. The same identity holds for Svelte's `flatMerge(prev, ...)` (core runs `flatMerge(prev, that)` again: `flatMerge(prev, flatMerge(prev, X)) ≡ flatMerge(prev, X)`) and Solid's `mergeProps(prev, ...)`.

**Before** (react, representative)

```ts
// sync options on every render
table.setOptions((prev) => ({
  ...prev,
  ...tableOptions,
}))
```

**After** (react; equivalently `() => mergedOptions` for the other 7)

```ts
// sync options on every render (core merges with current options)
table.setOptions(() => tableOptions)
```

**Big-O:** −1 full O(K) object allocation + K property copies per render/sync per adapter. React at 100Hz resize: −100 options-object allocs/sec plus GC pressure; the result object is byte-for-byte identical because the outer merge re-spreads `prev` first. Solid bonus: dropping the inner merge also halves the proxy/getter layering growth (see the Solid getter-chain risk in the correctness section).

**Risk:** Verified equivalent per merge path, including undefined-key and dropped-key corners on both the spread and flatMerge paths. Touch all 8 call sites consistently.
**Verification:** CONFIRMED (equivalence proven for all three merge-path families).

---

## 98. F6: Lit/Alpine pass a mergeOptions that duplicates the default merge, forcing core's slow descriptor path — Score: 5

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/lit-table/src/TableController.ts:159–167`; `packages/alpine-table/src/createTable.ts:37–45`
**Category:** `big-o` (short-circuit), `allocation`

Hot path: Lit: every host render (`table()` is called in `render()` and calls `setOptions` unconditionally). Alpine: every options effect run. `table_mergeOptions` has an explicit fast path (one spread) when no `mergeOptions` is provided. When `mergeOptions` IS provided, it runs the user merge PLUS `Object.getOwnPropertyDescriptors(mergedOptions)`, a descriptors spread, `Object.create`, and `Object.defineProperties` over every key: 3 extra O(K) passes with `defineProperty` per `setOptions`. The lit/alpine `mergeOptions` is literally the same shallow spread the fast path already performs, so these adapters pay the getter-preservation machinery for zero behavioral difference. (Vue/Solid/Svelte provide `mergeOptions` intentionally for getter/proxy semantics; those are justified.)

**Before** (lit)

```ts
mergeOptions: (
  defaultOptions: TableOptions<TFeatures, TData>,
  newOptions: Partial<TableOptions<TFeatures, TData>>,
) => {
  return {
    ...defaultOptions,
    ...newOptions,
  }
},
```

**After**

Delete the `mergeOptions` property from both adapters' merged construct options.

**Big-O:** Per `setOptions` (per lit host render): 4 O(K) object passes → 1; removes ~K `defineProperty` calls (K ≈ 30-60) per render. Result object identical (all descriptors are plain data properties after a spread anyway).

**Risk:** Very low; verify no lit/alpine consumer relies on `options.mergeOptions` being defined. Land together with F5 and F8 (same per-render Lit/Alpine setOptions pipeline).
**Verification:** CONFIRMED (fast path vs descriptor path results proven identical).

---

## 99. F8: Lit table() spreads the entire table instance on every host render — Score: 5

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/lit-table/src/TableController.ts:183–193`
**Category:** `allocation`

Hot path: every host render (per state write × host, per resize tick). The table instance carries on the order of 100+ own enumerable properties (feature APIs are constructed onto the instance). Spreading copies all of them into a fresh object per render, evaluates the enumerable `options` getter, and gives consumers a new identity every render. Verifier bonus: the spread also snapshots the `options` accessor into a stale plain value on the wrapper each render; the mutate-once fix makes `options` reads live again, a small correctness bonus.

**Before**

```ts
// Capture for closure
const tableInstance = this._table

return {
  ...this._table,
  subscribe,
  FlexRender,
  get state() {
    return (selector?.(tableInstance.store.state) ??
      tableInstance.store.state) as TSelected
  },
} as unknown as LitTable<TFeatures, TData, TSelected>
```

**After**

```ts
if (!this._table) {
  // ...
  this._table = constructTable(mergedOptions)
  const t = this._table as any
  t.subscribe = subscribe
  t.FlexRender = FlexRender
  this._setupSubscriptions()
}
this._selector = selector // store latest selector on the controller
// define `state` once at construct:
Object.defineProperty(this._table, 'state', {
  configurable: true,
  get: () =>
    this._selector?.(this._table!.store.state) ?? this._table!.store.state,
})
return this._table as unknown as LitTable<TFeatures, TData, TSelected>
```

**Big-O:** −1 O(100+)-property object copy per host render (per tick during resize); table identity becomes stable; `options` accessor stops being snapshotted stale.

**Risk:** Consumers relying on a fresh object per render (none should; other adapters mutate the instance, e.g. react attaches `Subscribe`/`FlexRender` onto it). Land with F5/F6.
**Verification:** CONFIRMED (react mutate-the-instance precedent verified; stale-options-snapshot bonus added).

---

## 100. F13: Vue options sync: drop the mergeProxy hop and the redundant Set spread — Score: 5

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/vue-table/src/useTable.ts:22–44,85–92,123–129`; `packages/vue-table/src/merge-proxy.ts:93`
**Category:** `allocation`, `big-o`

Hot path: every reactive option/controlled-state change; per resize tick in controlled onChange mode (warm; hot when sizing state is controlled via refs). (a) The watch getter maps all K option keys through `unref` and allocates a K-length array per re-run; since the getter returns a new array each time, the callback fires on every trigger of any tracked dep. (b) Each fire runs `getOptionsWithReactiveValues` (K unrefs + K-key object + a `mergeProxy` Proxy allocation) and then `flatMerge` over that proxy: `Reflect.ownKeys` hits the `keys()` trap, which concatenates all sources' keys and dedupes via `[...Array.from(new Set(keys))]` (the spread duplicates the array `Array.from` already produced), then every key read goes through the proxy `get` trap's reverse linear source scan. Net: ~4-5 full O(K) passes plus 2K proxy trap hits per sync. (c) The `mergeProxy(options, resolvedOptions)` wrapper is unnecessary in the output: `resolvedOptions` already contains every key.

**Before**

```ts
function getOptionsWithReactiveValues(options) {
  const resolvedOptions: Record<string, unknown> = {}
  for (const key of Object.keys(options)) {
    resolvedOptions[key] = unref(options[key as keyof ...])
  }
  return mergeProxy(options, resolvedOptions)
}
// ...
  watch(
    () => getReactiveOptionDeps(mergedOptions),
    () => {
      syncTableOptions(coreTable, mergedOptions)
    },
    { immediate: true },
  )
```

**After** (drop the proxy hop)

```ts
function getOptionsWithReactiveValues(options) {
  const resolvedOptions: Record<string, unknown> = {}
  for (const key of Object.keys(options)) {
    const v = unref(options[key as keyof ...])
    if (v !== undefined) resolvedOptions[key] = v
  }
  return resolvedOptions   // plain object: flatMerge reads it trap-free
}
```

and in `merge-proxy.ts:93`: `return Array.from(new Set(keys))`.

**Big-O:** Per sync: −1 Proxy allocation, −2K trap-mediated reads (each a reverse scan over sources with an `in` check), −1 duplicate K-length array. Big-O stays O(K) with ~3× lower constant; matters at tick frequency in controlled-sizing mode.

**Risk (verifier-added `ref(undefined)` note):** Currently a `ref(undefined)`-valued option LEAKS the raw ref object through the mergeProxy get-trap fallback (`resolveSource` unwraps sources, not values); the plain-object proposal returns/omits `undefined` instead. That is arguably a fix, but it is observable and must be flagged. Plain-`undefined` keys behave identically (flatMerge skips them either way). `getReactiveOptionDeps` is still needed for dependency tracking; its array alloc is inherent to the watch-getter form.
**Verification:** AMENDED: `ref(undefined)` raw-ref-leak behavior delta added (the proposal observably changes, and fixes, it).

---

## Score 4

## 4. `flattenBy()` is recursive `forEach` — Score: 4

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/utils.ts:88–107`
**Category:** `micro`

Used in `row_getLeafRows` and every column tree flatten. Replace `.forEach(callback)` with an indexed loop to avoid the per-item callback allocation and to allow JIT inlining.

**Before**

```ts
const recurse = (subArr: Array<TNode>) => {
  subArr.forEach((item) => {
    flat.push(item)
    const children = getChildren(item)
    if (children.length) {
      recurse(children)
    }
  })
}
```

**After**

```ts
const recurse = (subArr: Array<TNode>) => {
  for (let i = 0; i < subArr.length; i++) {
    const item = subArr[i]
    flat.push(item)
    const children = getChildren(item)
    if (children.length) recurse(children)
  }
}
```

**Big-O:** Same. Constant-factor (and protects against deep-recursion stack growth marginally).

**Scale impact** (callback allocations saved per `flattenBy` call — dimension: nodes flattened):

| Nodes flattened | Before (callbacks) | After | Saved  |
| --------------- | ------------------ | ----- | ------ |
| 10              | 10                 | 0     | 10     |
| 100             | 100                | 0     | 100    |
| 1,000           | 1,000              | 0     | 1,000  |
| 10,000          | 10,000             | 0     | 10,000 |

**Risk:** None.

**2026-07-01 audit (D12, score 4):** Corrected call site: the grouped-model caller is `features/column-grouping/createGroupedRowModel.ts:117`, and with a single grouping column (`depth 0`) `flattenBy` is never called from there; R-scale traffic needs grouping length ≥ 2 or `row_getLeafRows` usage. Classic-for rewrite is behavior-identical (recursion depth = grouping depth 2–3, fine).
**Verification:** Verified (2026-07-01 audit).

---

## 20. `createCoreRowModel` deps `[table.options.data]` is fragile — Score: 4 (correctness leaning)

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/.../createCoreRowModel.ts:25`
**Category:** `memoization`

Today's dep is `table.options.data`. If a consumer recreates the options object (`options = { ...options, data: sameRef }`) the memo still works (same data reference). But if a consumer also recreates `data` per render without intent, the entire row model rebuilds. Consider exposing this as an atom (`table.atoms.data`) so adapters can route data identity through the reactivity layer instead of options identity.

**Risk:** Medium — surface change. Not strictly required, but a foundational correctness sharpening.

**2026-07-01 audit note:** Verified during the fresh audit: rows are NOT rebuilt on `columns` changes — `createCoreRowModel` memoDeps are `[table.options.data]` only, so rows survive column-def swaps. That gates any column-keyed per-row cache (see #92 / C11, which requires a WeakMap for exactly this reason), and it means `row._valuesCache` (keyed by column id) survives column-def swaps too; staleness is avoided today only because accessor results are keyed by id and accessorFns rarely change per id. Keep as an observation.

---

## 29. `filterRowModelFromLeafs` duplicates predicate work — Score: 4

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/column-filtering/filterRowsUtils.ts:43–101`
**Category:** `micro`

`filterRow(row)` is called twice in some branches. Cache the boolean and the `hasVisibleSubRows` flag, branch once.

**Scale impact** (duplicate `filterRow` invocations saved — dimension: rows in subtree-bearing branches per filter pass):

| Rows in subtree-bearing branches | Before (`filterRow` calls) | After  | Saved  |
| -------------------------------- | -------------------------- | ------ | ------ |
| 10                               | 20                         | 10     | 10     |
| 100                              | 200                        | 100    | 100    |
| 1,000                            | 2,000                      | 1,000  | 1,000  |
| 10,000                           | 20,000                     | 10,000 | 10,000 |

**Risk:** Logic is subtle; needs unit-test coverage when refactored.

**2026-07-01 audit (B6, score 4 — verified simplification):** The from-leafs branch calls `filterRow(row)` (an O(F) tag scan) twice per passing branch row, and the first of two identical-bodied branches is provably subsumed by the second (`(A && !B)` implies `(A || B)`). Fix: single `if (newRow.subRows.length || filterRow(row))` — checking subRows first also skips the predicate entirely for parents kept alive by children. Boolean-identical simplification, verified airtight; opt-in `filterFromLeafRows` path only.
**Verification:** Verified (2026-07-01 audit); boolean equivalence proven.

---

## 32. `groupBy` uses `Array.prototype.reduce` (broadened by B11: createGroupedRowModel loop fusion) — Score: 4

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/column-grouping/createGroupedRowModel.ts:204–220`
**Category:** `micro`

Trivial `for` loop replacement of `.reduce`.

**Risk:** None.

**2026-07-01 audit (B11, score 4 — broadened):** Per grouping level (`createGroupedRowModel.ts:100–221`), `Array.from(map.entries()).map(...)` materializes a redundant tuples array, subRows are walked twice with two closures (a parentId pass and a flatRows pass), and `groupBy` uses `.reduce` with a per-call closure over R rows. Fix: iterate the Map directly, fuse the two subRow passes into one classic loop, de-`reduce` `groupBy`. Order-safety verified (`constructRow`/`Object.assign` read neither `parentId` nor `groupedFlatRows`).
**Verification:** Verified (2026-07-01 audit); order-safety proven.

---

## 59. `table.getAllLeafColumns()` is called many places per row-model build — Score: 4

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** filterFns, faceting, grouping, pinning, global filtering
**Category:** `memoization`

`getAllLeafColumns()` is memoized at the table level, but its deps are sometimes computed inline (see #16 type defects). Verify the memo holds across the row-model rebuild lifecycle. If it doesn't, this is the most-leveraged optimization in the package.

**Risk:** Already memoized in `coreColumnsFeature`; just audit for accidental dep churn.

---

## 105. A10: contextDocument operator precedence: parameter always ignored; SSR ReferenceError path (bug) — Score: 4 (bug)

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/features/column-resizing/columnResizingFeature.utils.ts:189–190`
**Category:** `bug`

Parses as `(_contextDocument || typeof document !== 'undefined') ? document : null`. Consequences: (1) a caller-supplied `_contextDocument` (e.g. an iframe or shadow-root document, the parameter's whole purpose, and it is publicly exposed through `header.getResizeHandler`) is NEVER used; the global `document` is always chosen. (2) In an environment where `_contextDocument` IS provided but global `document` is undefined, the truthy left side selects the bare identifier `document` → ReferenceError.

**Before**

```ts
const contextDocument =
  _contextDocument || typeof document !== 'undefined' ? document : null
```

**After**

```ts
const contextDocument =
  _contextDocument ?? (typeof document !== 'undefined' ? document : null)
```

**Verification:** CONFIRMED-BUG (both consequences re-derived).

---

## 113. A7: table_getTotalSize reduce closure calls the static header_getSize, bypassing per-header memos — Score: 4

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `columnSizingFeature.utils.ts:319–403` (`table_getTotalSize` + L/C/R variants)
**Category:** `micro`, `memoization`

The `.reduce` closure calls the STATIC `header_getSize` (full subtree recursion, bypassing per-header memos) on every recompute, per onChange tick.

**Fix:** Classic loop summing `callMemoOrStaticFn(header, 'getSize', header_getSize)`; leaf headers untouched by the drag hit their memo cache. (`??`-safe: `getSize` returns numbers, `0` included.)

**Risk:** None; `getSize` always returns a number, so the `??` fallback in `callMemoOrStaticFn` is safe (`0` is a valid included value).
**Verification:** Verified (2026-07-01 audit).

---

## 114. A8: header_getSize recurse closure → explicit-stack rewrite (remaining scope) — Score: 4

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts:272` (`header_getSize`; registration `columnSizingFeature.ts:93–103`)
**Category:** `micro`, `allocation`

`header_getSize` allocates a `recurse` closure + per-level forEach per recompute (per tick for group headers).

**Cross-refs / gating:** Half of this finding already landed: the vestigial `position` dep slot on `header_getStart`'s memoDeps was dropped in PR #6367 together with the A2 deps fix (see perf-done.md #67). This entry covers ONLY the remaining scope — rewriting `header_getSize`'s `recurse` closure (still present at `columnSizingFeature.utils.ts:272`) into an explicit-stack loop.

**Fix:** Explicit-stack loop, pushing subHeaders in REVERSE order (mandatory, not optional, to preserve summation order exactly).

**Risk:** Order-sensitive: subHeaders must be pushed onto the stack in reverse order or the rewrite silently changes summation order for group headers. This is a correctness requirement of the rewrite, not an optional tuning choice.
**Verification:** Verified (2026-07-01 audit).

---

## 118. B14: createExpandedRowModel Object.keys(expanded ?? {}) materializes an R-sized array to test emptiness — Score: 4

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `createExpandedRowModel.ts:41–51`
**Category:** `micro`

`Object.keys(expanded ?? {})` materializes a possibly R-sized key array just to test emptiness (expand-all materializes R entries), plus an `?? {}` alloc.

**Cross-refs / gating:** Corrected premise (verifier): `paginateExpandedRows` defaults to TRUE (rowExpandingFeature.ts:39), so the check-reorder only helps explicit `paginateExpandedRows: false` configs; the O(|expanded|) key-array elimination stands on the default path.

**Fix:** Allocation-free `hasAnyKey` probe.

**Big-O:** O(|expanded|) key-array allocation eliminated on the default (`paginateExpandedRows: true`) path; expand-all previously materialized R entries just to test emptiness.

**Risk:** None beyond the scope correction noted above: the check-reorder benefit is narrower than originally filed, applying only to explicit `paginateExpandedRows: false` configs.
**Verification:** Verified (2026-07-01 audit).

---

## 121. C1: row-pinning visibleRows.find per pinned row, O(P×R) (gated on keepPinnedRows: false) — Score: 4

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `rowPinningFeature.utils.ts:108–139`
**Category:** `micro`, `big-o`

`visibleRows.find((r) => r.id === rowId)` per pinned row = O(P×R) + P closures, per row-model/pinning change.

**Cross-refs / gating:** Gated on `keepPinnedRows: false` (non-default; the default path never hits it).

**Fix:** Build a `visibleRowsById` map once in the `!keepPinnedRows` branch (`rowsById` cannot be substituted: paginated/expanded models pass through the FULL pre-model `rowsById`, verified). Note the map builds twice (top+bottom are separate memo entries).

**Big-O:** O(P×R) find scan (plus P closures) replaced by an O(R) map build + O(P) lookup pass.

**Risk:** The existing `rowsById` cannot be substituted for the new map — paginated/expanded models pass through the full pre-model `rowsById`, verified; the `visibleRowsById` map builds twice since top and bottom pinning are separate memo entries.
**Verification:** Verified (2026-07-01 audit).

---

## 122. C5: Object.values(expanded).some(Boolean) / Object.keys(expanded).length materialize O(E) arrays for boolean answers — Score: 4

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `rowExpandingFeature.utils.ts:178, 203` (+ `createExpandedRowModel.ts:43`)
**Category:** `micro`

`Object.values(expanded).some(Boolean)` / `Object.keys(expanded).length` materialize O(E) arrays for boolean answers (E scales with R).

**Cross-refs / gating:** Patch alongside #123 (C6) and #124 (C7) as one sweep sharing the same `for...in` idiom, rather than landing independently.

**Fix:** `for...in` early-exit probes.

**Big-O:** O(E) array materialization replaced with an early-exit `for...in` probe (E scales with R).

**Risk:** Expanded/selection state can be a user-provided plain object (controlled state), so optionally guard with `hasOwn` to match doctrine.
**Verification:** Verified (2026-07-01 audit).

---

## 123. C6: row_toggleExpanded copies the expanded map twice on collapse; expand-all exit materializes O(R) keys — Score: 4

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `rowExpandingFeature.utils.ts:258–296` (`row_toggleExpanded`)
**Category:** `micro`

Collapse path copies the whole expanded map via `Object.assign` then copies E-1 entries AGAIN into `rest` (2×E writes + wasted map + keys array); expand-all exit materializes an O(R) key array + forEach closure, then iterates all R keys again.

**Fix:** Fused branch layout building the result map directly per (exists × expanded) case; also removes a currently wasted O(R) materialization on the `old === true` no-op path. Per-interaction path.

**Big-O:** 2×E writes on collapse reduced to a single fused pass; O(R) key-array materialization removed from both the expand-all exit and the `old === true` no-op path.

**Risk:** None noted; per-interaction path (not per-render), so absolute win is smaller than R-scale row-model findings but well-isolated.
**Verification:** Verified (2026-07-01 audit).

---

## 124. C7: Object.keys(rowSelection).length builds an S-length array to test non-emptiness — Score: 4

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `rowSelectionFeature.utils.ts:329–351`
**Category:** `micro`

`Object.keys(rowSelection).length` builds an S-length array (S up to 100k) solely to test non-emptiness, per selection change.

**Fix:** Loop-break `for...in` probe (or reuse the already-memoized `getSelectedRowIds().length`). Key-existence semantics preserved.

**Risk:** None noted; key-existence semantics preserved exactly.
**Verification:** Verified (2026-07-01 audit).

---

## 137. F11: React useTable useMemo spread recomputes every render (React Compiler validation required) — Score: 4

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/react-table/src/useTable.ts:183–192` (preact mirror at `packages/preact-table/src/useTable.ts`)
**Category:** `micro`, `render-path`

`useMemo(() => ({...table, options, state}), [table, tableOptions, state])` recomputes every render because `tableOptions` is a fresh literal each time: a 100+ property spread per render, plus a new `table` identity that defeats downstream memoization (already acknowledged in-code with a ref workaround). A deliberate, documented React Compiler tradeoff.

**Fix:** **Any change requires React Compiler validation first**; the mutate-and-return-stable variant changes observable identity semantics that downstream memoization currently relies on. Report as a measured tradeoff rather than a fix to land unilaterally.

**Big-O:** 100+ property spread per render (full table-object shape), plus a fresh `table` identity per render that defeats downstream memoization.

**Risk:** Substantial if changed carelessly: this is a deliberate, documented tradeoff, and the mutate-and-return-stable alternative changes observable identity semantics. Gate any change on React Compiler validation.
**Verification:** Verified (2026-07-01 audit); requires mandatory React Compiler validation before any change lands.

---

## 138. F12: React/Preact inline selectors defeat useSyncExternalStoreWithSelector memoization (adapter part) — Score: 4

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/react-table/src/useTable.ts:181`; `packages/react-table/src/Subscribe.ts:141–148` (preact mirrors at `packages/preact-table/src/useTable.ts`, `packages/preact-table/src/Subscribe.ts`)
**Category:** `micro`, `render-path`

Inline selectors change identity per render, so `useSyncExternalStoreWithSelector` discards its memoized selection every render: one extra selector run plus compare, per render, per subscriber. Even the default `selector = (s) => s` parameter is a fresh function per call.

**Fix:** Stable wrapper reading the latest selector from a ref.

**Cross-refs / gating:** The dominant per-tick half of the original F12 (core's unbatched double atom write in updateOffset) is DONE: it shipped with A3 in PR #6367 (perf-done.md #66). This entry covers only the adapter selector-stabilization part.

**Big-O:** One extra selector run plus one extra compare per render per subscriber, from inline/fresh-identity selectors — including the default `selector = (s) => s`, which is a fresh function per call.

**Risk:** Low; the fix is a standard stable-ref wrapper pattern. Must preserve default-selector semantics exactly.
**Verification:** Verified (2026-07-01 audit).

---

## 143. NR2: Solid mergeProps getter-chain accumulation on controlled-state syncs — Score: 4

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/solid-table/src/createTable.ts:68–102` (`mergeProps` used both in the updater and as core `mergeOptions`)
**Category:** `render-path`, `observation`

Solid's `createTable` uses `mergeProps` both in the updater and as core `mergeOptions`; for getter-valued option keys (idiomatic `get data() {...}` in Solid), each sync layers resolution over the previous options object, growing lookup depth and retained memory by one layer per controlled-state change (per tick when sizing is controlled). The Svelte adapter had exactly this bug and fixed it with `flatMerge` (`merge-objects.ts` comment cites issue #6235); Solid did not get the equivalent fix.

**Fix:** Needs a runtime repro to confirm Solid's static-path `resolveSources` binding, then port `flatMerge`. F5 (#97) halves the layering growth but does not eliminate it.

**Big-O:** Lookup depth and retained memory grow by one extra layer per controlled-state change (per tick when sizing is controlled), before any fix; F5 (#97) halves this growth but does not eliminate it.

**Risk:** Unconfirmed severity: needs a runtime repro before scoping the fix. Left unaddressed, layering grows unbounded across the life of a controlled-state table.
**Verification:** Needs a runtime repro to confirm Solid's static-path `resolveSources` binding (not yet executed as of the 2026-07-01 audit).

---

## Score 3

## 6. `createColumnHelper()` allocates a fresh object on every call — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/helpers/columnHelper.ts:94–117`
**Category:** `micro`, `bundle-size`

The helper is stateless. Hoist a module-level singleton and return it.

**Before**

```ts
export function createColumnHelper<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): ColumnHelper<TFeatures, TData> {
  return {
    accessor: (accessor, column) => {
      return typeof accessor === 'function'
        ? ({
            ...column,
            accessorFn: accessor,
          } as any)
        : {
            ...column,
            accessorKey: accessor,
          }
    },
    columns: <TColumns extends ReadonlyArray<ColumnDef<TFeatures, TData, any>>>(
      columns: [...TColumns],
    ): Array<ColumnDef<TFeatures, TData, any>> & [...TColumns] =>
      columns as Array<ColumnDef<TFeatures, TData, any>> & [...TColumns],
    display: (column) => column,
    group: (column) => column,
  }
}
```

**After**

```ts
const COLUMN_HELPER = {
  accessor: (accessor: any, column: any) => ({ ...column, accessorKey: accessor, ... }),
  columns: (columns: any) => columns,
  display: (column: any) => column,
  group: (column: any) => column,
}
export function createColumnHelper<...>(): ColumnHelper<TFeatures, TData> {
  return COLUMN_HELPER as any
}
```

**Risk:** None. Methods are pure.

**2026-07-01 audit note:** The audit's verified-clean list classifies the helpers (`columnHelper`, `tableFeatures`, `tableOptions`, `metaHelper`) as cold or type-only setup-time code; this entry is a candidate for skipping.

---

## 25. `column_setFilterValue` re-searches array — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/column-filtering/columnFilteringFeature.utils.ts:198–232`
**Category:** `micro`

Calls `.find()` then `.map()` over the same array. Use `findIndex` and slice in/around it.

**Risk:** None.

---

## 106. F15: Angular #shouldRecreateEntireView() bitmask is constant-false (bug) — Score: 3 (bug)

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/angular-table/src/flex-render/renderer.ts:254–260` (flags at `packages/angular-table/src/flex-render/flags.ts:10,15`)
**Category:** `bug`

`ContentChanged & ViewFirstRender` = `(1<<1) & (1<<0)` = `0`, so the expression is provably always 0 and the destroy-and-recreate branch at renderer.ts:214 is dead. **Verifier-corrected impact:** effects do NOT accumulate (recreation is guarded by `!this.#currentRenderEffectRef`, and since the old ref is never destroyed/nulled, exactly one effect persists). Actual impact: the old render effect survives content changes, `RenderEffectChecked` is never reset (the skip-first-call dance never re-arms), and a function→non-function content swap leaves a now-pointless effect running dirty checks. A correctness cleanup with tests, not a perf leak.

**Before**

```ts
  #shouldRecreateEntireView() {
    return (
      this.#renderFlags &
      FlexRenderFlags.ContentChanged &
      FlexRenderFlags.ViewFirstRender
    )
  }
```

**Fix:** `this.#renderFlags & (FlexRenderFlags.ContentChanged | FlexRenderFlags.ViewFirstRender)`; re-verify the `RenderEffectChecked` dance once the branch becomes reachable, since never-destroying has been the de facto behavior.

**Verification:** AMENDED / CONFIRMED-BUG, severity LOW-MODERATE (headline "unbounded effect accumulation" claim refuted; dead branch and stale-effect handling confirmed). Score 3.

---

## 107. C16: getTopRows/getBottomRows memoDeps omissions (observation) — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/features/row-pinning/rowPinningFeature.ts:74–87`
**Category:** `observation`, `memoization`

The fns read `options.keepPinnedRows`, `getPrePaginatedRowModel().rowsById` (via `getRow(id, true)`), and `row_getIsAllParentsExpanded` (expanded atom + `options.getIsRowExpanded`); none are deps. Masked in default configs (expanded changes cascade into `getRowModel().rows` identity), but reachable with `manualExpanding` (default `keepPinnedRows: true` + tree data) or runtime `keepPinnedRows` flips: stale pinned rows.

**Fix:** Add `table.atoms.expanded?.get()`, `table.getPrePaginatedRowModel()`, `table.options.keepPinnedRows`, `table.options.getIsRowExpanded` to both tuples.

**Big-O:** Extra recomputes are O(P), negligible.

**Risk:** None noted.
**Verification:** CONFIRMED (observation; dep list verified complete).

---

## 110. D4: memo() empty-deps footgun: statically empty deps never compute (observation) — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/utils.ts:154,160`
**Category:** `observation`, `bug` (latent)

Initial `deps = []` means a `memoDeps` returning `[]` compares equal on the first call and the memo returns `undefined` forever without ever running `fn`. Latent (all core deps are non-empty literals) but a direct footgun for custom features.

**Fix:** Declare `let deps: Array<any> | undefined` with no initializer; empty-deps memos then compute once and cache.

**Risk:** None noted.
**Verification:** CONFIRMED.

---

## 111. D5: memo() commits deps before running fn: a throw poisons the cache (observation) — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/utils.ts:175–181`
**Category:** `observation`, `bug` (latent)

If `fn` throws, `deps` is already updated; the next call with identical deps silently returns the PREVIOUS result.

**Fix:** Move `deps = newDeps` after `result = fn(...)`.

**Risk:** Verifier re-entrancy note: the reorder converts a hypothetical self-re-entrant memo from "returns stale" to "infinite recursion"; all recursive memo chains in core (`column_getStart`, `column_getAfter`, `header_getStart`, `column_getIsVisible`) were audited and recurse only into OTHER instances' memos, never self, so no current site is affected.
**Verification:** CONFIRMED with re-entrancy amendment.

---

## 112. D7: callMemoOrStaticFn nullish-fallback contract: silent double-execution for nullish-returning memoized APIs (observation) — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/utils.ts:459–472`
**Category:** `observation`

`obj[fnKey]?.(...args) ?? staticFn(obj, ...args)` silently double-executes for any memoized API returning nullish. All 31 fnKeys currently routed return non-nullish values (verified), but `column_getFacetedMinMaxValues` returns `[number, number] | undefined` and would double-execute if ever routed.

**Fix:** Dispatch on method EXISTENCE, not result nullishness.

**Risk:** None noted; latent (all 31 currently routed fnKeys return non-nullish values).
**Verification:** CONFIRMED (latent; hardening).

---

## 115. A9: getColumn(header.column.id) round-trips and columnSizingStart includes non-leaf group headers — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `columnResizingFeature.utils.ts:95–121`
**Category:** `micro`

`header.table.getColumn(header.column.id)` is an id round-trip returning the SAME instance as `header.column`, twice per header per render; and at drag start `columnSizingStart` includes non-leaf group headers, so the commit loop does wasted work and writes junk group-column ids (default size 150) into `columnSizing` state.

**Cross-refs / gating:** The `header_getLeafHeaders` loop cleanup is deduped into #130 (D13); not part of this entry's fix scope.

**Fix:** Use `header.column` directly (zero-risk); filter `columnSizingStart` to leaf headers only.

**Behavior-change flag (mandatory):** the leaf-only filter changes committed state shape (no more group-column-id sizing entries); nothing in-repo reads them, but this needs a maintainer decision.

**Risk:** Behavior-change: leaf-only filter changes committed `columnSizingStart` state shape (drops non-leaf group-column-id entries); nothing in-repo currently reads them, but this needs a maintainer decision before landing.
**Verification:** Verified (2026-07-01 audit).

---

## 117. B13: createGroupedRowModel empty-grouping reset forEach — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `createGroupedRowModel.ts:57–63`
**Category:** `micro`

Empty-grouping reset does a closure `forEach` over top-level rows on every recompute.

**Cross-refs / gating:** An optional skip flag for this reset must reuse #28's (B2) rowModel-marker technique rather than inventing a new one.

**Fix:** Classic `for(;;)` (zero-risk).

Note: the grouped branch mutates NESTED rows (`subRows`, `parentId`) that this top-level-only reset never repairs; that gap is pre-existing, do not fix silently in a perf pass.

**Risk:** Pre-existing gap, not to fix here: the grouped branch mutates nested rows (`subRows`, `parentId`) that this top-level-only reset never repairs.
**Verification:** Verified (2026-07-01 audit).

---

## 120. B21: createPaginatedRowModel flatRows threaded then discarded; paginateExpandedRows missing from memoDeps — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `createPaginatedRowModel.ts:25–31, 55–82`
**Category:** `micro`

`flatRows` threaded into temp objects then unconditionally discarded (`= []`); forEach+closure walk; `table.options.paginateExpandedRows` read by memoDeps and fn without being a dep (stale window narrower than filed: needs the expanded atom absent).

**Fix:** Build with `flatRows: []` from the start, classic loops, add `table.options.paginateExpandedRows` to memoDeps.

**Risk:** The missing memoDep only manifests when the expanded atom is absent (a narrower stale-window than originally filed); adding it to memoDeps closes the gap regardless.
**Verification:** Verified (2026-07-01 audit).

---

## 125. C13: .filter(getCanSelect) materializes an intermediate array and defeats .some short-circuit — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `rowSelectionFeature.utils.ts:363–382, 412–424`
**Category:** `micro`

`.filter(getCanSelect)` materializes an intermediate array and exhausts the predicate before `.some` can short-circuit.

**Fix:** Single fused pass with early exit (edge semantics verified equal: no selectable rows → false; predicate assumed side-effect-free).

**Risk:** Assumes `getCanSelect` is side-effect-free; edge semantics verified equal (no selectable rows → false).
**Verification:** Verified (2026-07-01 audit).

---

## 126. C15: row_getValue hit path does hasOwn + second keyed lookup; cache re-loaded repeatedly — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `coreRowsFeature.utils.ts:20–37` (`row_getValue`, the hottest per-cell call)
**Category:** `micro`

Hit path does `hasOwn` + second keyed lookup; miss path writes then re-reads; `row._valuesCache` re-loaded repeatedly.

**Fix:** Hoist the cache to a local, compute once, `valuesCache[columnId] = value; return value`. Preserves cached-`undefined` semantics exactly; same pattern applies to `row_getUniqueValues`.

**Risk:** None noted; preserves cached-`undefined` semantics exactly. Same pattern applies to `row_getUniqueValues` (not covered by this entry).
**Verification:** Verified (2026-07-01 audit).

---

## 127. D9: header/group ids built via [..].filter(Boolean).join('\_'): 2 array allocations per header — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `buildHeaderGroups.ts:59–63, 97–100`
**Category:** `micro`

Header/group ids built via `[..].filter(Boolean).join('_')`: 2 array allocations per header per build; plus a depth-0 quirk (numeric `depth` is dropped by `filter(Boolean)` at 0 in header ids while the stringified group id keeps `'0'`).

**Fix:** Direct concat, byte-identical strings required including the depth-0 omission; snapshot test over depths 0-3 with/without headerFamily before landing (ids are React keys).

**Risk:** Byte-identical strings required, including the depth-0 omission quirk; snapshot test over depths 0-3 with/without headerFamily before landing — header/group ids are React keys, so any drift breaks reconciliation.
**Verification:** Verified (2026-07-01 audit).

---

## 128. D10: headersToGroup.forEach(closure) in the hottest header-build loop — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `buildHeaderGroups.ts:69–120`
**Category:** `micro`

`headersToGroup.forEach(closure)` in the hottest header-build loop.

**Fix:** Classic `for(;;)`, identical body.

**Risk:** None noted; identical body, zero-risk rewrite.
**Verification:** Verified (2026-07-01 audit).

---

## 129. D11: recurseHeadersForSpans returns N×D short-lived span objects — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/core/headers/buildHeaderGroups.ts:140–181` (`recurseHeadersForSpans`)
**Category:** `micro`

Returns N×D short-lived `{colSpan, rowSpan}` objects plus per-parent arrays that exist only so the parent can sum/min the values.

**Fix:** Void recursion; the parent iterates `header.subHeaders`, re-checking visibility per child (a memoized cache hit), and reads `child.colSpan`/`child.rowSpan` directly. Must NOT read spans from invisible children (they keep `constructHeader` defaults). **Condition: each `getIsVisible` cache hit still allocates its memoDeps array, which caps the win; microbenchmark the header-build path before landing.**

**Big-O:** N×D short-lived object allocations (N headers × D depth) per header-group build, eliminated by the void-recursion rewrite; the per-child `getIsVisible` memoDeps array allocation remains and caps the realized win.

**Risk:** Must not read spans from invisible children, which keep `constructHeader` defaults — an easy correctness slip in the rewrite. Land only after microbenchmarking the header-build path, per the audit's explicit condition.
**Verification:** Verified (2026-07-01 audit).

---

## 130. D13: header_getLeafHeaders uses .map for side effects — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/core/headers/coreHeadersFeature.utils.ts:31–42` (`header_getLeafHeaders`)
**Category:** `micro`

`h.subHeaders.map(recurseHeader)` allocates and discards a result array per node, purely for side effects.

**Fix:** Indexed loop; traversal order preserved. Absorbs A9's third bullet (#115); keep this formulation.

**Risk:** None noted; the rewrite is traversal-order-identical.
**Verification:** Verified (2026-07-01 audit).

---

## 132. D15: cloneState uses Object.defineProperty per key — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/utils.ts:34–45` (`cloneState`)
**Category:** `micro`

`Object.defineProperty` (descriptor allocation, ~5-10× slower than assignment) is used for every key of every plain object; this runs only on the construct/reset path.

**Fix:** Plain assignment, keeping the `defineProperty` escape only for `'__proto__'` on Object.prototype-backed copies (the one unsafe key).

**Big-O:** ~5–10× slower than plain assignment per key (descriptor allocation via `Object.defineProperty`); construct/reset path only, not a hot per-render path.

**Risk:** Must retain the `defineProperty` escape hatch for the `'__proto__'` key on Object.prototype-backed copies; dropping it entirely would reintroduce a prototype-pollution/property-redefinition hazard.
**Verification:** Verified (2026-07-01 audit).

---

## 134. E11: row_getGroupingValue guarded re-read after write — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts:267–293` (`row_getGroupingValue`)
**Category:** `micro`

Computed `getGroupingValue` result is re-read via a guarded lookup right after being written. **Corrected claim (verifier):** for cache-less rows the current code never CALLS `getGroupingValue` at all (the call sits inside the cache guard); the proposal introduces that call plus a value return, which is unreachable in practice since `initRowInstanceData` always installs the cache.

**Fix:** Compute into a local, write it if the cache exists, and return the local. The common-path per-row `getColumn` call can only be removed by the caller (`groupBy` pre-resolving `getGroupingValue` per level).

**Risk:** Low: the verifier-corrected claim shows the cache-less path this targets is unreachable in practice, so the realized win is narrower than originally filed.
**Verification:** Verifier-corrected (2026-07-01 audit): cache-less call path confirmed unreachable in practice; fix itself still confirmed safe.

---

## 140. F16: Solid FlexRender Switch/Match builds 3 reactive condition memos per cell (memo-variant only) — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/solid-table/src/FlexRender.tsx:81–129`
**Category:** `micro`

`Switch`/`Match` builds 3 reactive condition memos plus keyed-callback wrappers per cell for what is a static discrimination (~150k extra reactive nodes at a 50k-cell mount).

**Fix:** Wrap the body in a single memo over the three props with a flat conditional; this still removes most of the `Switch`/`Match` overhead. **Memo-based variant ONLY is sanctioned:** the plain-destructure rewrite is NOT behavior-preserving in Solid — with `<Index each={cells}>`, `props.cell` changes on a live `FlexRender` instance and an untracked one-shot read would serve stale cells, and moving `getIsAggregated()`/`getIsPlaceholder()` into the untracked body would freeze grouping-mode branches.

**Big-O:** ~150k extra reactive nodes at a 50k-cell mount from the per-cell `Switch`/`Match` condition memos and keyed-callback wrappers.

**Risk:** Landing the plain-destructure variant instead of the memo-based variant would introduce stale-cell bugs under `<Index>` and freeze grouping-mode branches. Only the memo-based rewrite is safe to ship.
**Verification:** Verified (2026-07-01 audit); memo-based variant confirmed safe, plain-destructure variant checked and rejected as not behavior-preserving in Solid.

---

## Score 2

## 7. `storeReactivityBindings()` allocates fresh bindings on every call — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/store-reactivity-bindings.ts:19–36`
**Category:** `micro`

Same pattern as #6. Hoist a singleton.

**Risk:** None.

---

## 10. `replaceAll('.', '_')` in `constructColumn` — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/core/columns/constructColumn.ts:54–59`
**Category:** `micro`

`split('.').join('_')` outperforms `replaceAll` for single-char replacement in many engines. One-time cost per column.

**Risk:** None.

---

## 26. `filterableIds` mutated with `.push` after creation — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/column-filtering/createFilteredRowModel.ts:88–101`
**Category:** `micro`

Build the array once with the global filter id conditionally appended.

**Risk:** None.

---

## 31. `existingGrouping.includes` called twice per `getValue` — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/column-grouping/createGroupedRowModel.ts:141, 154`
**Category:** `micro`

Cache the boolean. Subsumed by #30 once Set lookup lands but worth noting independently.

**Scale impact** (duplicate `.includes` walks saved per cell access — dimension: grouped rows × cell reads):

| Grouped rows × cell reads | Before (2 walks/cell) | After (1 walk/cell) | Saved walks |
| ------------------------- | --------------------- | ------------------- | ----------- |
| 10 × 10 = 100             | 200                   | 100                 | 100         |
| 100 × 20 = 2,000          | 4,000                 | 2,000               | 2,000       |
| 1,000 × 50 = 50,000       | 100,000               | 50,000              | 50,000      |
| 10,000 × 100 = 1,000,000  | 2,000,000             | 1,000,000           | 1,000,000   |

**Risk:** None.

---

## 44. `table_getPageOptions` `Array.from(new Array(pageCount)).fill(null).map((_, i) => i)` — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/row-pagination/rowPaginationFeature.utils.ts:215–225`
**Category:** `micro`, `bundle-size`

**Before**

```ts
const pageCount = table_getPageCount(table)
let pageOptions: Array<number> = []
if (pageCount && pageCount > 0) {
  pageOptions = [...new Array(pageCount)].fill(null).map((_, i) => i)
}
return pageOptions
```

**After**

```ts
if (pageCount <= 0) return []
return Array.from({ length: pageCount }, (_, i) => i)
```

**Risk:** None.

---

## 45. `row_getPinnedIndex` allocates intermediate id array — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/row-pinning/rowPinningFeature.utils.ts:247–261`
**Category:** `micro`

`.map(({ id }) => id).indexOf(row.id)` → `findIndex(r => r.id === row.id)`.

**Risk:** None.

**2026-07-01 audit (C12, score 2):** Re-verified. Amended fix: replace `.map(({ id }) => id).indexOf(row.id)` with a direct indexed scan over the pinned-rows array returning `i`/`-1` (classic loop) rather than `findIndex` with a closure — removes both the P-length intermediate array and the per-call closure.
**Verification:** Verified (2026-07-01 audit).

---

## 56. `filterFn_greaterThanOrEqualTo` / `lessThanOrEqualTo` delegate via 2–3 function calls — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/fns/filterFns.ts:149–195`
**Category:** `micro`, `bundle-size` (tradeoff)

Currently `>=` runs `>` then `=`. Could inline the comparison directly, at the cost of more code. Worth it only if profiling shows these in hot loops.

**Risk:** Bundle size grows slightly.

**2026-07-01 audit note:** Cross-ref: #94 (E4) pre-parses the filter value via `resolveFilterValue`, which subsumes most of this delegation cost if adopted; E4 is gated on the #101 (E3) resolveFilterValue bug fix.

---

## 60. Prototype-builder boilerplate repeats 4× — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `constructCell.ts`, `constructColumn.ts`, `constructHeader.ts`, `constructRow.ts`
**Category:** `bundle-size`

Each file has a `getXyzPrototype(table)` function with identical shape — `if (!table._xyzPrototype) { table._xyzPrototype = { table }; for (...) feature.assignXyzPrototype?.(...) }`. Could collapse to a shared utility keyed by `prototypeKey`/`assignMethodName`. Saves ~300–500 bytes gzipped at the cost of indirection at construction time only.

**Risk:** Slight loss of readability. Worth doing only if running close to a size-limit budget.

---

## 119. B20: getSubRows dereferenced twice per row; child row-id built via array + join — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `createCoreRowModel.ts:50–91`, `coreRowsFeature.utils.ts:215–228`
**Category:** `micro`

`table.options.getSubRows` dereferenced twice per row; default child row-id built via `[parent.id, index].join('.')` (array + join per child row).

**Fix:** Hoist `getSubRows` once per rebuild; `parent.id + '.' + index` / `String(index)`. Exactly equivalent.

**Risk:** None noted; fix is exactly equivalent to the current behavior.
**Verification:** Verified (2026-07-01 audit).

---

## 139. F14: Angular lazySignalInitializer proxy never retires (demoted) — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/angular-table/src/lazySignalInitializer.ts:20–46`
**Category:** `micro`

The lazy-init Proxy never goes away: every `table.*` member read pays a trap plus init-check forever, and `getOwnPropertyDescriptor` returns descriptors without value/get (lying to callers), even once cold. **Verifier-corrected claims:** the `options` getter closes lexically over `table` (no `this`), so there is NO trap re-entry and dropping `receiver` changes nothing material; and only direct `table.*` reads trap (`getRowModel()` returns raw rows/cells), so a CD pass performs a handful of trapped reads, not tens of thousands.

**Fix:** Hoist the null check (`if (object === null) initializeObject()`); eager-init is a design question for the owner, not addressed by this fix.

**Big-O:** Verifier-corrected: a CD pass performs a handful of trapped Proxy reads, not tens of thousands as originally filed, since `getRowModel()` returns raw rows/cells that bypass the trap.

**Risk:** Demoted from the original filing after verification; remaining scope is the null-check hoist only. Eager-init remains an open design question for the owner, out of scope for this fix.
**Verification:** Verifier-corrected (2026-07-01 audit): no trap re-entry, and CD passes trap only a handful of reads rather than tens of thousands; finding demoted accordingly (score 2).

---

## 141. F18: Adapter micro grab-bag: schedule wrapper closures, double options() call, Subscribe spread, per-subscribe observable rebuild — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/preact-table/src/reactivity.ts:27`, `packages/vue-table/src/reactivity.ts:76`, `packages/solid-table/src/reactivity.ts:71`, `packages/svelte-table/src/reactivity.svelte.ts:72`, `packages/lit-table/src/reactivity.ts:27`, `packages/alpine-table/src/reactivity.ts:27` (item 1); `packages/angular-table/src/injectTable.ts:109–112` (item 2); `packages/react-table/src/useTable.ts:161–168` (item 4); `packages/angular-table/src/reactivity.ts:22–28,48–54` (item 5)
**Category:** `micro`

One grouped entry for four items from the F18 grab-bag (per-item scores 1-2): (1) `schedule: (fn) => queueMicrotask(() => fn())` wrapper closures in the preact/vue/solid/svelte/lit/alpine reactivity bindings; use `queueMicrotask(fn)` directly, as react-table already does. (2) `angular-table/src/injectTable.ts:109-112`: `options()` is invoked twice during construction; hoist it. Cold. (4) `react-table/src/useTable.ts:161-168`: the `Subscribe` wrapper allocates `{...props, source}` per `Subscribe` render; pass through when `props.source` is already set. (5) `angular-table/src/reactivity.ts:22-28,48-54`: each `subscribe()` builds a fresh `computed` + `toObservable` + effect instead of caching one observable per atom; mount-time only.

**Fix:** As described per item above: use `queueMicrotask(fn)` directly (1); hoist the duplicated `options()` call (2); pass through `props` when `source` is already set instead of spreading (4); cache one observable per atom instead of rebuilding on each `subscribe()` (5).

**Cross-refs / gating:** Item (3) from the original F18 bullet (`vue-table/src/merge-proxy.ts:93`: `[...Array.from(new Set(keys))]` spread duplicates the array `Array.from` already built) is subsumed by #100 (F13) and is NOT part of this grouped entry.

**Risk:** None noted; all four items are cold, one-time, or mount-time costs, consistent with their 1-2 per-item scores.
**Verification:** Verified (2026-07-01 audit).

---

## 144. NR3: Vue getOptionsWithReactiveValues leaks raw ref objects for ref(undefined)-valued options (observation) — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `packages/vue-table/src/useTable.ts:22–33` (`getOptionsWithReactiveValues`); leak surfaces via the get-trap fallback at `packages/vue-table/src/merge-proxy.ts:55–92` (`resolveSource`)
**Category:** `observation`

`getOptionsWithReactiveValues` leaks raw `ref` objects for `ref(undefined)`-valued options through the `mergeProxy` get-trap fallback (`resolveSource` unwraps sources, not values).

**Fix:** None needed as an independent fix; #100 (F13)'s plain-object fix changes (and fixes) this observably as a side effect.

**Risk:** Latent today (no known in-repo consumer relies on the leaked ref); fixed incidentally, and observably, by #100 (F13).
**Verification:** Verified (2026-07-01 audit); latent, fixed incidentally by #100 (F13).

---

## Score 1

## 8. `FlexRender` has redundant `'X' in props` checks — Score: 1

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/flex-render.ts:46–70`
**Category:** `micro`, `bundle-size`

TypeScript narrows the discriminated union via the truthy check alone.

**Before**

```ts
if ('cell' in props && props.cell) {
  return flexRender(props.cell.column.columnDef.cell, props.cell.getContext())
}

if ('header' in props && props.header) {
  return flexRender(
    props.header.column.columnDef.header,
    props.header.getContext(),
  )
}

if ('footer' in props && props.footer) {
  return flexRender(
    props.footer.column.columnDef.footer,
    props.footer.getContext(),
  )
}

return null
```

**After**

```ts
if (props.cell) { ... }
if (props.header) { ... }
if (props.footer) { ... }
```

**Risk:** None.

**2026-07-01 audit note:** Cross-ref: new entry #75 (F3) targets the adjacent dead class-component check in the same react/preact dispatch; the `'X' in props` checks here remain separately valid.

---

## 19. `constructTable` `Object.assign` with `undefined` from optional feature method — Score: 1

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/core/table/constructTable.ts:46–50`
**Category:** `micro`

Guard against the `undefined` return from `feature.getDefaultTableOptions?.()`.

**Risk:** None.

---

# `@tanstack/table-core` — Performance Refactor Catalog: Done

Generated from `perf.md`. The original `perf.md` is intentionally preserved.
2026-07-01: merged with the fresh audit in `perf.md` (findings A1–F18 and verification new-risks mapped to entries 62–147; legacy entries 1–61 retained).

Entries are sorted by adjusted effectiveness score descending.

## Counts

- **Entries:** 48
- **Source findings:** 46
- **Cross-cutting sweeps:** 2

## Score 9

## 62. B1: Faceted row model does a full O(R) rebuild when its filter set is empty — Score: 9

**Status:** `[x]` done
**Implementation note:** Added the post-exclusion empty-filter guard in `createFacetedRowModel`, returning `preRowModel` directly when the only active filter is the faceted column's own filter. Added regression coverage for identity reuse and for preserving filtering by other columns.

**Location:** `packages/table-core/src/features/column-faceting/createFacetedRowModel.ts:59–84`
**Category:** `big-o` (short-circuit)

Hot path: Per state-change: every columnFilters/globalFilter keystroke, per faceted column. The extremely common case "the only active filter is on the faceted column itself" (one filter input with a facet dropdown/range on the same column) yields `filterableIds.length === 0`. `filterRowsImpl` then returns `true` for every row, yet `filterRows` still walks all R rows, pushes into a new `flatRows` array, inserts R entries into a new `rowsById` map, and calls `constructRow` clones for rows with subRows. The result is content-identical to `preRowModel`. At R=100k this is a full O(R) pass with R keyed-map insertions per keystroke, per faceted column.

**Before**

```ts
if (!preRowModel.rows.length || (!columnFilters?.length && !globalFilter)) {
  return preRowModel
}

const filterableIds: Array<string> = []
if (columnFilters) {
  for (let i = 0; i < columnFilters.length; i++) {
    const id = columnFilters[i]!.id
    if (id !== columnId) filterableIds.push(id)
  }
}
if (globalFilter) filterableIds.push('__global__')
// ...
return filterRows(preRowModel.rows, filterRowsImpl, table)
```

**After**

```ts
if (globalFilter) filterableIds.push('__global__')

if (!filterableIds.length) {
  return preRowModel
}
```

**Big-O:** O(R) → O(1) for the excluded-own-filter-only case: ~100k iterations + ~100k object-map insertions + 2 array allocations avoided per keystroke per faceted column (~10-30ms at 100k rows). Verified bonus: `getFacetedUniqueValues`/`getFacetedMinMaxValues` memoDeps key on `.flatRows` identity, so the stable `preRowModel` reference also converts the downstream O(R) facet-map rebuild into a memo hit per keystroke.

**Risk:** Returns `preRowModel` by reference instead of a fresh model with identical contents; same referential behavior as the existing empty-filter branch. For hierarchical data there is a flatRows-order note: the current all-pass `filterRows` emits child-before-parent flatRows while `preRowModel` is parent-first, so facet `Map` insertion order can shift (content identical; the existing no-filter branch already returns parent-first, so precedent exists). The early return never reads tags, so B17's ordering constraint does not apply.
**Verification:** CONFIRMED, raised 8 → 9; verifier added the downstream facet-map memo-hit win and the hierarchical flatRows-order note.

---

## Score 8

## 35. `row_getLeftVisibleCells` / `row_getRightVisibleCells` use `.find` in pin loop — Score: 8

**Status:** `[x]` done
**Implementation note:** Original audit proposed building a per-call `Map<columnId, cell>` inside each getter. Final implementation went further: reuses the already-memoized `row_getVisibleCellsByColumnId` lookup record (deps `[row.getAllCells(), columnVisibility]`) rather than rebuilding a Map on every call. Result: O(P) bracket lookups per call, with the underlying record amortized to zero rebuild cost across multiple pin-side getters on the same row. Added an early return when the pin side is empty (consistent with the rest of the codebase). Behavior preserved: `cell.position = 'left' | 'right'` mutation, ordering by pin-array index, and hidden-column exclusion via the visible-cells record.

**Location:** `src/features/column-pinning/columnPinningFeature.utils.ts:216–224, 250–257`
**Category:** `big-o`

Each pinned column triggers a linear `.find` over _all_ visible cells of a row. With P pinned and C visible per row, this is O(P × C) per row, per render. Build a `Map<columnId, cell>` once at the top.

**Before**

```ts
for (const columnId of left) {
  const cell = allVisibleCells.find((c) => c.column.id === columnId)
  if (cell) {
    cell.position = 'left'
    cells.push(cell)
  }
}
```

**After**

```ts
const allVisibleCells = callMemoOrStaticFn(
  row,
  'getVisibleCellsByColumnId',
  row_getVisibleCellsByColumnId,
)
const cells: Array<Cell<TFeatures, TData, unknown>> = []
for (let i = 0; i < left.length; i++) {
  const columnId = left[i]!
  const cell = allVisibleCells[columnId]
  if (cell) {
    // Assign position property directly to preserve prototype chain
    ;(cell as any).position = 'left'
    cells.push(cell)
  }
}
return cells
```

**Big-O:** O(P × C) → O(P + C) per row.

**Scale impact** (`.find` comparisons saved per render — dimension: rows × pinned cols × visible cells; average `.find` walks ½ the visible-cell list):

| Rows (R) | Visible cells/row (C) | Pinned cols (P) | Before (R × P × C/2) | After (R × (P + C)) | Saved     |
| -------- | --------------------- | --------------- | -------------------- | ------------------- | --------- |
| 10       | 10                    | 2               | 100                  | 120                 | -20       |
| 100      | 20                    | 4               | 4,000                | 2,400               | 1,600     |
| 1,000    | 50                    | 6               | 150,000              | 56,000              | 94,000    |
| 10,000   | 100                   | 10              | 5,000,000            | 1,100,000           | 3,900,000 |

**Risk:** None. The mutation `cell.position = 'left'` is unchanged.

---

## 37. `passiveEventSupported()` caching bug — Score: 8 (bug)

**Status:** `[x]` done
**Implementation note:** Hoisted `let passiveSupported: boolean | null = null` from inside the function to module scope. Previously the cache check `if (typeof passiveSupported === 'boolean') return passiveSupported` was unreachable on first call and the variable was reset to `null` on every subsequent call, so each invocation re-probed the DOM via `window.addEventListener('test', ...)` + `removeEventListener`. After the hoist the cache actually persists: first call probes once, all later calls short-circuit. Implemented exactly as proposed.

**Location:** `src/features/column-resizing/columnResizingFeature.utils.ts:320–343`
**Category:** `bug`, `micro`

`passiveSupported` is declared _inside_ the function (`let passiveSupported: boolean | null = null`), so the cache check `if (typeof passiveSupported === 'boolean') return passiveSupported` is unreachable on first call and **the cache is reset on every call**. Each resize call probes the DOM via `addEventListener('test', ...)`.

**Before**

```ts
export function passiveEventSupported() {
  let passiveSupported: boolean | null = null
  if (typeof passiveSupported === 'boolean') return passiveSupported
  let supported = false
  try { window.addEventListener('test', noop, options); ... }
  ...
  passiveSupported = supported
  return passiveSupported
}
```

**After**

```ts
let passiveSupported: boolean | null = null

export function passiveEventSupported() {
  if (typeof passiveSupported === 'boolean') return passiveSupported

  let supported = false
  try {
    const options = {
      get passive() {
        supported = true
        return false
      },
    }

    const noop = () => {}

    window.addEventListener('test', noop, options)
    window.removeEventListener('test', noop)
  } catch (err) {
    supported = false
  }
  passiveSupported = supported
  return passiveSupported
}
```

**Big-O:** Avoid a DOM listener add+remove on every resize-handler hook-up.

**Risk:** None. Behavior is what the original obviously intended.

---

## 38. `table_getTotalSize` and the L/C/R variants are not memoized — Score: 8

**Status:** `[x]` done
**Implementation note:** Added `memoDeps: () => [table.atoms.columnSizing?.get(), table.getHeaderGroups()]` to all four entries (`table_getTotalSize`, `table_getLeftTotalSize`, `table_getCenterTotalSize`, `table_getRightTotalSize`) in `columnSizingFeature.ts`. Matches the pattern already used by `table_getFooterGroups` / `table_getFlatHeaders`: `table.getHeaderGroups()` is itself memoized against every input that can change the header-row composition (columns, columnOrder, grouping, columnPinning, columnVisibility, groupedColumnMode), so its ref is a compact proxy that holds steady while the underlying inputs don't change. The only other dep is `columnSizing` for per-column width state. Deliberately omitted `columnResizing` — with `columnResizeMode: 'onChange'` (the typical resize-aware setup) the resize handler writes through to `columnSizing` directly, so depending on `columnResizing` would cause redundant invalidations on every drag-move tick without changing the output.

**Location:** `src/features/column-sizing/columnSizingFeature.ts:142–154`
**Category:** `memoization`, `big-o`

All four (`getTotalSize`, `getLeftTotalSize`, `getCenterTotalSize`, `getRightTotalSize`) have **no `memoDeps`** in the feature config. Each call does `.reduce(...)` over the header group, summing `header_getSize` per header (which is itself memoized but still walks the entire array). Layout code reads these every render — for virtualizers, every scroll tick.

**Before**

```ts
table_getTotalSize: { fn: () => table_getTotalSize(table) },
table_getLeftTotalSize: { fn: () => table_getLeftTotalSize(table) },
table_getCenterTotalSize: { fn: () => table_getCenterTotalSize(table) },
table_getRightTotalSize: { fn: () => table_getRightTotalSize(table) },
```

**After**

```ts
table_getTotalSize: {
  fn: () => table_getTotalSize(table),
  memoDeps: () => [
    table.atoms.columnSizing?.get(),
    table.getHeaderGroups(),
  ],
},
table_getLeftTotalSize: {
  fn: () => table_getLeftTotalSize(table),
  memoDeps: () => [
    table.atoms.columnSizing?.get(),
    table.getHeaderGroups(),
  ],
},
table_getCenterTotalSize: {
  fn: () => table_getCenterTotalSize(table),
  memoDeps: () => [
    table.atoms.columnSizing?.get(),
    table.getHeaderGroups(),
  ],
},
table_getRightTotalSize: {
  fn: () => table_getRightTotalSize(table),
  memoDeps: () => [
    table.atoms.columnSizing?.get(),
    table.getHeaderGroups(),
  ],
},
```

**Big-O:** O(H) per call → O(1) until column sizing/visibility/pinning changes. High-frequency read path.

**Scale impact** (`header_getSize` invocations skipped — dimension: renders × headers per render; assumes deps unchanged):

| Renders (R) | Headers (H) | Before (R × H) | After (1 × H + later invalidations) | Saved (steady state) |
| ----------- | ----------- | -------------- | ----------------------------------- | -------------------- |
| 10          | 10          | 100            | 10                                  | 90                   |
| 100         | 50          | 5,000          | 50                                  | 4,950                |
| 1,000       | 100         | 100,000        | 100                                 | 99,900               |
| 10,000      | 500         | 5,000,000      | 500                                 | 4,999,500            |

Virtualizers calling `getTotalSize()` per scroll tick amplify this dramatically.

**Risk:** None. Deps fully capture inputs.

---

## 42. `row_getIsAllParentsExpanded` checks the wrong row (bug) — Score: 8 (bug)

**Status:** `[x]` done
**Implementation note:** One-character fix — changed `row_getIsExpanded(row)` to `row_getIsExpanded(currentRow)` inside the parent-walk loop. Previously the function checked the original `row` on every iteration instead of the parent it had just walked to, which made the loop a no-op past the first iteration and returned wrong results (e.g. a leaf row would report "all parents expanded" whenever the leaf itself was expanded, regardless of any collapsed ancestor). Added a comment explaining the intent. Downstream caller in `rowPinningFeature.utils.ts:122` (the `if (row_getIsAllParentsExpanded(fullRow))` check that decides whether a pinned row should appear) automatically gets the correct semantic — pinned rows now correctly account for their ancestor chain's expansion state instead of accidentally tracking the pinned row's own expansion.

**Location:** `src/features/row-expanding/rowExpandingFeature.utils.ts:324–337`
**Category:** `bug`

The loop walks parents but calls `row_getIsExpanded(row)` (original row) instead of `row_getIsExpanded(currentRow)`. Returns wrong result and the loop iterations are wasted.

**Before**

```ts
while (isFullyExpanded && currentRow.parentId) {
  currentRow = row.table.getRow(currentRow.parentId, true)
  isFullyExpanded = row_getIsExpanded(row)
}
```

**After**

```ts
while (isFullyExpanded && currentRow.parentId) {
  currentRow = row.table.getRow(currentRow.parentId, true)
  isFullyExpanded = row_getIsExpanded(currentRow)
}
```

**Big-O:** Correctness fix. Currently the loop is effectively a no-op past one iteration (always re-checks the same `row`).

**Risk:** Behavior changes — verify with tests; this is the intended logic.

---

## 61. `column_getAutoSortFn` never auto-selects `alphanumeric`/`datetime` — `isString` fallback clobbers the match (bug) — Score: 8 (bug)

**Status:** `[x]` done
**Implementation note:** Restored v8's early-return precedence (datetime → alphanumeric → text → basic). Discovered during the adversarial verification of #52. The v9 refactor had converted v8's in-loop `return sortingFns.datetime` / `return sortingFns.alphanumeric` (v8 `RowSorting.ts` `getAutoSortingFn`) into assignments to a shared `sortFn` local — but any string value in the sample also sets `isString = true`, and the trailing `if (isString) sortFn = sortFns?.text` unconditionally overwrote the match. Net effect: the auto path never selected `alphanumeric` (dead code) and `datetime` was clobbered whenever any sampled value was a string; digit-bearing string columns silently got plain `text` sorting (`"item10"` before `"item2"`). Each restored early return is guarded (`if (sortFns?.datetime) return ...`) so a custom registry missing an entry falls through to the next preference instead of returning `undefined`. Added `tests/unit/features/row-sorting/rowSortingFeature.utils.test.ts` covering all four selections plus empty-rows and missing-registry-entry fallbacks (no row-sorting utils tests existed before). Related to #50, which fixed the row sampling in the same function. Note for #52: this fix makes `compareAlphanumeric` reachable via the auto path again, so #52's allocation refactor is now worth pursuing.

**Location:** `src/features/row-sorting/rowSortingFeature.utils.ts:84–122`
**Category:** `bug`

**Before**

```ts
for (let i = 0; i < firstRows.length; i++) {
  const value = firstRows[i]!.getValue(column.id)
  if (Object.prototype.toString.call(value) === '[object Date]') {
    sortFn = sortFns?.datetime
  }
  if (typeof value === 'string') {
    isString = true
    if (value.split(reSplitAlphaNumeric).length > 1) {
      sortFn = sortFns?.alphanumeric
    }
  }
}
if (isString) {
  sortFn = sortFns?.text // clobbers any datetime/alphanumeric match above
}
return sortFn ?? sortFn_basic
```

**After**

```ts
for (let i = 0; i < firstRows.length; i++) {
  const value = firstRows[i]!.getValue(column.id)

  if (Object.prototype.toString.call(value) === '[object Date]') {
    if (sortFns?.datetime) {
      return sortFns.datetime
    }
  }

  if (typeof value === 'string') {
    isString = true

    if (value.split(reSplitAlphaNumeric).length > 1) {
      if (sortFns?.alphanumeric) {
        return sortFns.alphanumeric
      }
    }
  }
}

if (isString) {
  return sortFns?.text ?? sortFn_basic
}

return sortFn_basic
```

**Risk:** Behavior changes for tables relying on the broken default — string columns containing digits now natural-sort (the documented v8 behavior) instead of lexicographic `text` sort.

---

## 63. A1: Table-level column offsets record replaces per-column getStart/getAfter memos — Score: 8

**Status:** `[x]` done
**Implementation note:** Shipped in PR #6367 (47fc97d2f), landed together with the A2 deps fix (#67) exactly as the audit required. `table_getColumnOffsets` is registered as a table-level memo in columnSizingFeature.ts (registration at :97+), with the `ColumnOffsetsByPosition` type added in columnSizingFeature.types.ts; the per-column `getStart`/`getAfter` memos were removed and re-registered as plain prototype fns doing O(1) record lookups. Maintainer note: no felt difference at example scales once the rAF coalescing in the resize handler landed (see #66); kept for the single-slot thrash-cliff removal, the 2N-resident-closure memory reduction, and the `getColumnOffsets` primitive itself.

**Location:** `packages/table-core/src/features/column-sizing/columnSizingFeature.ts:54–75` and `packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts:100–168`
**Category:** `memoization`, `big-o`

Per tick (onChange resize mode, 60-120Hz) and per render pass. Absolute/sticky layouts call `cell.column.getStart(...)` per visible cell (R_vis × N per render; e.g. `examples/react/column-resizing/src/main.tsx:319` per cell, `examples/react/column-pinning-sticky/src/main.tsx:47-48` calls `getStart('left')`/`getAfter('right')` per cell). The deps tuple contains the ENTIRE `columnSizing` object, whose identity changes on every onChange tick (`Object.assign(makeObjectMap(), old, newColumnSizing)` in `updateOffset`). So resizing ONE column invalidates ALL N columns' `getStart` AND `getAfter` memos every tick. Each recompute walks the recursive chain (`prev.getStart + prev.getSize`) via `callMemoOrStaticFn`; recursion depth is up to N for the far column, and every recursion frame re-evaluates a 6-element memoDeps array plus 5 atom reads. Per tick at N=500 that is ~1000 memo recomputes and ~3000+ transient dep-array allocations, plus 2N permanently resident `tableMemo` closures (`_memo_getStart`, `_memo_getAfter`) per table. There is also a single-slot thrash hazard: a column whose `getStart` is called with two different positions in one render (e.g. `getStart('left')` for sticky style and `getStart()` for a virtualizer) recomputes on every call because `position` lives in the one deps slot.

**Before**

(registration, columnSizingFeature.ts:54-75):

```ts
      column_getStart: {
        fn: (column, position) => column_getStart(column, position),
        memoDeps: (column, position) => [
          position,
          table.options.columns,
          table.atoms.columnSizing?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
        ],
      },
      column_getAfter: {
        fn: (column, position) => column_getAfter(column, position),
        memoDeps: (column, position) => [
          position,
          table.options.columns,
          table.atoms.columnSizing?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
        ],
      },
```

and the recursive static fns (columnSizingFeature.utils.ts:100-128; getAfter analogous at 141-168):

```ts
const index = callMemoOrStaticFn(column, 'getIndex', column_getIndex, position)
if (index <= 0) return 0

const visibleLeafColumns = callMemoOrStaticFn(
  column.table,
  'getPinnedVisibleLeafColumns',
  table_getPinnedVisibleLeafColumns,
  position,
)

const prevColumn = visibleLeafColumns[index - 1]!
return (
  callMemoOrStaticFn(prevColumn, 'getStart', column_getStart, position) +
  callMemoOrStaticFn(prevColumn, 'getSize', column_getSize)
)
```

**After**

(one table-level memoized offsets API, O(1) per-column lookups, per-column memos removed). In `columnSizingFeature.utils.ts`:

```ts
export interface ColumnOffsets {
  starts: Record<string, number>
  afters: Record<string, number>
}

export interface ColumnOffsetsByPosition {
  all: ColumnOffsets
  center: ColumnOffsets
  left: ColumnOffsets
  right: ColumnOffsets
}

function buildColumnOffsets<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(columns: Array<Column_Internal<TFeatures, TData, unknown>>): ColumnOffsets {
  const starts = makeObjectMap<number>()
  const afters = makeObjectMap<number>()
  const sizes = new Array<number>(columns.length)

  let start = 0
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i]!
    const size = callMemoOrStaticFn(column, 'getSize', column_getSize)
    sizes[i] = size
    starts[column.id] = start
    start += size
  }

  let after = 0
  for (let i = columns.length - 1; i >= 0; i--) {
    afters[columns[i]!.id] = after
    after += sizes[i]!
  }

  return { starts, afters }
}

export function table_getColumnOffsets<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): ColumnOffsetsByPosition {
  return {
    all: buildColumnOffsets(
      table_getPinnedVisibleLeafColumns(table) as Array<
        Column_Internal<TFeatures, TData, unknown>
      >,
    ),
    center: buildColumnOffsets(
      table_getPinnedVisibleLeafColumns(table, 'center') as Array<
        Column_Internal<TFeatures, TData, unknown>
      >,
    ),
    left: buildColumnOffsets(
      table_getPinnedVisibleLeafColumns(table, 'left') as Array<
        Column_Internal<TFeatures, TData, unknown>
      >,
    ),
    right: buildColumnOffsets(
      table_getPinnedVisibleLeafColumns(table, 'right') as Array<
        Column_Internal<TFeatures, TData, unknown>
      >,
    ),
  }
}

function toOffsetsKey(
  position: ColumnPinningPosition | 'center' | undefined,
): keyof ColumnOffsetsByPosition {
  return position === 'left'
    ? 'left'
    : position === 'right'
      ? 'right'
      : position === 'center'
        ? 'center'
        : 'all' // undefined | false -> full visible list
}

export function column_getStart<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  position: ColumnPinningPosition | 'center',
): number {
  const offsets = callMemoOrStaticFn(
    column.table,
    'getColumnOffsets',
    table_getColumnOffsets,
  )
  return offsets[toOffsetsKey(position)].starts[column.id] ?? 0
}

export function column_getAfter<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  position: ColumnPinningPosition | 'center',
): number {
  const offsets = callMemoOrStaticFn(
    column.table,
    'getColumnOffsets',
    table_getColumnOffsets,
  )
  return offsets[toOffsetsKey(position)].afters[column.id] ?? 0
}
```

Registration changes in `columnSizingFeature.ts`:

```ts
  constructTableAPIs: (table) => {
    assignTableAPIs('columnSizingFeature', table, {
      // ...existing APIs...
      table_getColumnOffsets: {
        fn: () => table_getColumnOffsets(table),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnSizing?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
          table.atoms.grouping?.get(),
          table.options.groupedColumnMode,
        ],
      },
    })
  },

  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs('columnSizingFeature', prototype, table, {
      column_getSize: { /* unchanged */ },
      // O(1) lookups now: register as plain non-memoized prototype fns,
      // removing 2N per-instance _memo_ closures (dead weight)
      column_getStart: {
        fn: (column, position) => column_getStart(column, position),
      },
      column_getAfter: {
        fn: (column, position) => column_getAfter(column, position),
      },
      column_resetSize: { /* unchanged */ },
    })
  },
```

Deps coverage (everything `table_getColumnOffsets` reads transitively): `table_getPinnedVisibleLeafColumns` → the L/C/R/all visible-leaf chains → `getAllColumns()` (reads `options.columns`), `orderColumns` (reads `columnOrder`, `grouping`, `groupedColumnMode`), pinning left/right arrays (`columnPinning`), `column_getIsVisible` (`columnVisibility`); `column_getSize` reads `columnDef` (covered by `options.columns`) and `columnSizing[column.id]` (covered by `columnSizing`). Tuple is statically non-empty and the fn always returns an object (never nullish, as `callMemoOrStaticFn`'s `??` fallback requires). No positional arg in the memo (all four position keys computed in one recompute), so render passes interleaving left/center/right cannot thrash it. Missing-column semantics preserved: `?? 0` reproduces the current `index <= 0` / `index < 0` / last-column returns exactly (verified for all five possible `position` values).

**Big-O:** The recompute path collapses from 2N chained memo recomputes (each with a 6-slot dep-array alloc + 5 atom reads + nested `getIndex`/dispatcher memo evals; ~1000 recomputes and ~3000+ array allocations per tick at N=500) to ONE recompute doing 4 classic-loop passes with 8 record allocations total. The single-slot position thrash disappears, and 2N resident `tableMemo` closures per table are removed (N=500: 1000 closures). Note the cache-hit cost is roughly unchanged: each plain `getStart` call still consults the table memo, which evaluates a 7-slot deps array + atom reads per call, comparable to today's per-column cache-hit cost. The wins are the recompute-path collapse, thrash elimination, and closure-memory reduction. Recompute is now O(N) on ANY sizing/order/pinning/visibility/grouping change even if only one region's offsets are consumed (acceptable: that is exactly when offsets change).

**Risk:** Medium-low. Public return shapes unchanged. **A1 MUST land together with A2's dependency fix**: `table_getColumnOffsets` reads through `callMemoOrStaticFn(table, 'getVisibleLeafColumns', ...)` whose memo currently omits `grouping`/`groupedColumnMode` (A2), so A1 alone would rebuild offsets from a stale column list and must not be advertised as a grouping-staleness fix on its own. Keep this offsets memo separate from A4's index memo (`columnSizing` must not invalidate indexes).
**Verification:** AMENDED: design confirmed sound; cache-hit metric corrected (roughly unchanged per call); the grouping-staleness fix is delivered only in combination with A2, on which this finding now explicitly depends.

---

## 64. E2: Allocation-free compareAlphanumeric — Score: 8

**Status:** `[x]` done
**Implementation note:** Implemented scanner-based `compareAlphanumeric` without per-comparison `split` arrays. Preserves existing comparator semantics, including remaining chunk-count return values and `parseInt` precision-collapse behavior for unusually large numeric chunks. User stress-test screenshots showed sorted-row-model reruns dropping from ~5.9-6.0s with the change stashed to ~3.5s with the change applied, about 41% lower elapsed time and in line with the reported "~45% faster" observation.

**Location:** `packages/table-core/src/fns/sortFns.ts:153–222` (called from `sortFn_alphanumeric` :18–30 and `sortFn_alphanumericCaseSensitive` :37–49)
**Category:** `allocation`

Hot path: Per comparison during sort: ~R log R calls per sorted rebuild. `createSortedRowModel` resolves the sortFn once per column, but every comparison re-splits both strings. Each comparison allocates 2 arrays plus one string per chunk via regex `.split`, then `parseInt` per numeric chunk. At R=100k that is ~1.7M comparisons × (2 arrays + ~2-6 chunk strings) ≈ 5-10M short-lived allocations per sort, the dominant GC pressure of the alphanumeric sort. The chunk walk can be done with index arithmetic on the original strings with zero allocations, preserving the exact comparison lattice (empty boundary chunks are skipped today, equivalent to scanning digit/non-digit runs; string chunks compare by code units exactly like `aa > bb`; numeric chunks compare like `parseInt` when leading zeros are skipped). Verifier re-derivation confirmed: chunks after empty-skipping are exactly maximal digit/non-digit runs; digit-free chunks always `parseInt` to NaN at radix 10; string-chunk `aa > bb` equals code-unit walk + length tiebreak; exhaustion sign equals the remaining-character test; mixed-chunk direction matches. There is no Infinity handling in the current code (`toString` maps Infinity to `''` upstream).

**Before**

```ts
function compareAlphanumeric(aStr: string, bStr: string) {
  const a = aStr.split(reSplitAlphaNumeric)
  const b = bStr.split(reSplitAlphaNumeric)
  // ...
  const an = parseInt(aa, 10)
  const bn = parseInt(bb, 10)
  // ...
}
```

**After**

```ts
function compareAlphanumeric(aStr: string, bStr: string) {
  const aLen = aStr.length
  const bLen = bStr.length
  let ai = 0
  let bi = 0

  while (ai < aLen && bi < bLen) {
    const aCode = aStr.charCodeAt(ai)
    const bCode = bStr.charCodeAt(bi)
    const aIsNum = aCode >= 48 && aCode <= 57
    const bIsNum = bCode >= 48 && bCode <= 57

    // One is a string chunk, one is a number chunk: the string chunk sorts first
    if (aIsNum !== bIsNum) {
      return aIsNum ? 1 : -1
    }

    // Find the end of each same-class run (digit run or digit-free run)
    let aEnd = ai + 1
    while (aEnd < aLen) {
      const c = aStr.charCodeAt(aEnd)
      if ((c >= 48 && c <= 57) !== aIsNum) break
      aEnd++
    }
    let bEnd = bi + 1
    while (bEnd < bLen) {
      const c = bStr.charCodeAt(bEnd)
      if ((c >= 48 && c <= 57) !== bIsNum) break
      bEnd++
    }

    if (aIsNum) {
      // Both are numbers: skip leading zeros, then longer digit run wins,
      // then digit-wise compare (equivalent to comparing parseInt results)
      let as = ai
      while (as < aEnd && aStr.charCodeAt(as) === 48) as++
      let bs = bi
      while (bs < bEnd && bStr.charCodeAt(bs) === 48) bs++

      const aDigits = aEnd - as
      const bDigits = bEnd - bs
      if (aDigits !== bDigits) {
        return aDigits > bDigits ? 1 : -1
      }
      for (let i = 0; i < aDigits; i++) {
        const ac = aStr.charCodeAt(as + i)
        const bc = bStr.charCodeAt(bs + i)
        if (ac !== bc) {
          return ac > bc ? 1 : -1
        }
      }
    } else {
      // Both are strings: code-unit lexicographic compare, same as `aa > bb`
      const aChunkLen = aEnd - ai
      const bChunkLen = bEnd - bi
      const minLen = aChunkLen < bChunkLen ? aChunkLen : bChunkLen
      for (let i = 0; i < minLen; i++) {
        const ac = aStr.charCodeAt(ai + i)
        const bc = bStr.charCodeAt(bi + i)
        if (ac !== bc) {
          return ac > bc ? 1 : -1
        }
      }
      if (aChunkLen !== bChunkLen) {
        return aChunkLen > bChunkLen ? 1 : -1
      }
    }

    ai = aEnd
    bi = bEnd
  }

  // One side is exhausted: the side with remaining chunks sorts last
  if (ai < aLen) return 1
  if (bi < bLen) return -1
  return 0
}
```

**Big-O:** Allocations per comparison: ~4-12 → 0. Per 100k-row sort: ~5-10M allocations eliminated; the work becomes a pure charCode walk. Same O(len) time, dramatically lower constant + GC.

**Risk:** Two observable deltas, both flagged. (a) Digit runs of 16+ digits: `parseInt` saturates double precision so today two huge, nearly equal digit runs can compare "equal" and fall through to the next chunk (and 309+-digit runs both become Infinity); the digit-wise compare orders them exactly instead. Decimal-to-double conversion is monotone, so parseInt only ever COLLAPSES distinctions; the proposal resolves those collapsed cases. Strictly more correct but observable; if bit-identical behavior is required, fall back to `parseInt(slice)` only for runs longer than 15 digits. (b) Return magnitude changes from ±chunk-count to ±1: sign-equivalent for sorting, but verify no test asserts exact comparator magnitudes. **Gate on `tests/unit/fns/sortFns.test.ts`.**
**Verification:** AMENDED: full re-derivation checks out; huge-digit-run behavior note expanded (parseInt-collapse direction proven), ±1 magnitude delta added, test-suite gate made explicit.

---

## 67. A2: grouping/groupedColumnMode omitted from sizing/pinning/visibility memoDeps: header/cell column misalignment after setGrouping (bug) — Score: 8 (bug)

**Status:** `[x]` done
**Implementation note:** Fixed in PR #6367 (47fc97d2f). `grouping` + `groupedColumnMode` added to the memoDeps tuples in columnPinningFeature.ts (6 registrations), columnVisibilityFeature.ts (`table_getVisibleLeafColumns` / `table_getVisibleFlatColumns`), and columnOrderingFeature.ts (`column_getIndex`, closing the `groupedColumnMode` gap). `header_getStart`'s vestigial `position` dep slot was also dropped (the half of A8 that belonged to this fix; A8's remaining closure-to-stack scope lives in todo #114). Two regression tests added in columnSizingFeature.utils.test.ts, verified to fail against the pre-fix deps.

**Location:**

- `packages/table-core/src/features/column-sizing/columnSizingFeature.ts:56–63, 67–74, 95–102` (`column_getStart`, `column_getAfter`, `header_getStart` deps)
- `packages/table-core/src/features/column-pinning/columnPinningFeature.ts:254–277` (`table_get{Left,Right,Center}LeafColumns` deps) and `:283–309` (`table_get{Left,Center,Right}VisibleLeafColumns` deps)
- `packages/table-core/src/features/column-visibility/columnVisibilityFeature.ts:94–101` (`table_getVisibleLeafColumns` deps) and `:86–101` (`table_getVisibleFlatColumns`, same gap; added during verification)

**Category:** `bug`, `memoization`

Per grouping state-change on any table with `columnGroupingFeature` enabled (default `groupedColumnMode: 'reorder'`, verified at columnGroupingFeature.ts:47). This is a default-configuration hazard. Leaf-column ORDER depends on grouping: `table_getAllLeafColumns` → `table_getOrderColumnsFn` → `orderColumns` reorders/removes grouped columns, and core registers `table_getAllLeafColumns` with `grouping` + `groupedColumnMode` in deps, as does core `table_getHeaderGroups`. But the derived memos above omit both: when `grouping` changes, `getAllLeafColumns` recomputes (new array), yet `table_getVisibleLeafColumns`, `table_getVisibleFlatColumns`, the pinning-region leaf-column memos, and the `column_getStart`/`getAfter`/`header_getStart` memos compare only unchanged inputs and return STALE cached arrays.

**Verified repro (verifier upgrade; worse than originally filed):** `setGrouping(['b'])` under the default `groupedColumnMode: 'reorder'` → `getAllLeafColumns` reorders → `getVisibleLeafColumns` returns the stale array → core `table.getHeaderGroups()` RECOMPUTES (its own deps do include grouping) but its static fn reads the stale `getVisibleLeafColumns` memo, so headers do NOT reorder, while `row.getAllCells()` (deps `[table.getAllLeafColumns()]`) evaluates fresh and cells DO reorder. Result: headers and cells disagree on column order after `setGrouping` on a default-config path. Meanwhile `column_getIndex` (whose deps do include grouping) can disagree with `getStart` in the same render.

**Before**

(columnPinningFeature.ts:292-300, representative):

```ts
      table_getCenterVisibleLeafColumns: {
        fn: () => table_getCenterVisibleLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
          table.atoms.columnOrder?.get(),
        ],
      },
```

**Fix:** (add `table.atoms.grouping?.get()` and `table.options.groupedColumnMode` to each tuple):

- `table_getVisibleLeafColumns` and `table_getVisibleFlatColumns` (columnVisibilityFeature.ts:86-101)
- `table_get{Left,Right,Center}LeafColumns` and `table_get{Left,Center,Right}VisibleLeafColumns` (columnPinningFeature.ts:254-309)
- `column_getStart`, `column_getAfter`, `header_getStart` (columnSizingFeature.ts:56-102); the `header_getStart` grouping slot absorbs A8's part (c)
- While there: `column_getIndex` deps include grouping but omit `groupedColumnMode`; add it (also covered if A4 lands)

**Big-O:** Correctness fix, not a performance metric. `getVisibleLeafColumns`, `getVisibleFlatColumns`, the pinning-region leaf-column memos, `getStart`/`getAfter`/`header_getStart`, and `column_getIndex`'s `groupedColumnMode` slot all return stale cached values after `setGrouping` under the default `groupedColumnMode: 'reorder'`, producing header/cell column-order divergence on every affected render until an unrelated dependency happens to invalidate the memo.

**Risk:** Low. Tables without the grouping feature get stably `undefined` for both new slots (never triggers recompute); the fix strictly aligns recompute triggers with actual data dependencies.

**Dependencies:** **A1 and C3 depend on this fix landing first.** A1's offsets memo and C3's render-path routing both read through `getVisibleLeafColumns`-family memos and would inherit the staleness if shipped alone.

**Verification:** CONFIRMED, severity upgraded to HIGH: the verifier derived the concrete header/cell misalignment repro and extended the affected set to core `table_getHeaderGroups` (transitively) and `table_getVisibleFlatColumns`.

---

## 101. E3: greaterThan/lessThan family declares testFalsy as resolveFilterValue — filter value replaced by a boolean (bug) — Score: 8 (bug)

**Status:** `[x]` done
**Implementation note:** Replaced the accidental `resolveFilterValue` metadata with `autoRemove` on `greaterThan`, `greaterThanOrEqualTo`, `lessThan`, and `lessThanOrEqualTo`; added focused unit coverage for the metadata behavior.

**Location:** `packages/table-core/src/fns/filterFns.ts:146, 165, 181, 197` (`greaterThan`, `greaterThanOrEqualTo`, `lessThan`, `lessThanOrEqualTo`)
**Category:** `bug`

`resolveFilterValue` is typed as `TransformFilterValueFn`: it TRANSFORMS the filter value. `createFilteredRowModel.ts:87` does `filterFn.resolveFilterValue?.(columnFilter.value) ?? columnFilter.value`; `testFalsy(30)` returns `false`, which is not nullish, so `resolvedValue` becomes `false`. `filterFn_greaterThan` then computes `Number(false) === 0` and compares every row against `0` (or `1` for a `null` filter value) regardless of the user's actual filter value. Verified end-to-end by the verifier; no other `resolveFilterValue` consumer exists to mask it. The unit tests call the fns directly with raw values, bypassing resolution, so the bug is test-invisible. Plainly a copy-paste of the `autoRemove` predicate onto the wrong key.

**Blast radius (verifier note):** These four fns are NOT in the `filterFns` string registry, so the bug triggers only via imported function values or custom registries; real, but narrower than "any greaterThan filter". `between`/`betweenInclusive` are unaffected (they delegate raw values internally and have correct `autoRemove`).

**Cross-refs / gating:** #94 (E4: greaterThan family pre-parse via resolveFilterValue) is strictly gated on this fix landing first.

**Before**

```ts
  { resolveFilterValue: (val: any) => testFalsy(val) },
```

(on all four fns; every other filterFn uses `autoRemove: (val: any) => testFalsy(val)` for this expression)

**After**

```ts
  { autoRemove: (val: any) => testFalsy(val) },
```

(on all four fns)

**Risk:** Changing to `autoRemove` additionally causes `null` filter values to be auto-removed from state; that matches every sibling filterFn's behavior and is evidently the intent. E4 is strictly gated on this fix.
**Verification:** CONFIRMED, severity HIGH for the affected fns.

---

## Cross-cutting sweep: loop fusion (`.map().flat()`, `.map().filter()`, `.map().map().filter()`)

**Status:** `[x]` done

**Adjusted score:** 8
**Original score:** n/a  
**Score note:** Completed cross-cutting allocation and loop-fusion sweep.

Eliminated back-to-back Array method chains across `packages/table-core/src/**` by fusing multiple passes into a single loop. Each chain was producing one intermediate array per stage; fused versions allocate exactly the final result array.

**Patterns covered:**

1. **`.map(hg => hg.headers).flat()`** — 5 sites, all flattening header-groups into a flat header list. Replaced each with a nested indexed `for` loop pushing into a single result array.
   - `core/headers/coreHeadersFeature.utils.ts` — `table_getFlatHeaders`
   - `core/headers/coreHeadersFeature.utils.ts` — `table_getLeafHeaders` (variant: maps to `header.getLeafHeaders()` arrays, same fusion shape)
   - `features/column-pinning/columnPinningFeature.utils.ts` — `table_getLeftFlatHeaders`, `table_getRightFlatHeaders`, `table_getCenterFlatHeaders`

2. **`.map().map().filter()` triple chain** — `createFacetedMinMaxValues.ts`. Fused into the min/max scan loop (which previously ran _after_ the three array stages). Single pass over `flatRows` with `Number()` coercion + NaN skip + inline min/max tracking. Replaces 3 intermediate array allocations of size N and the subsequent min/max walk over the resulting array.

3. **`.map(...).filter(predicate).forEach(mutate)` three-pass chain** — `rowPinningFeature.utils.ts` (`getPinnedRows`). Resolves pinned-row ids → row instances → drops misses → tags `position`, all in one loop. Eliminates 2 intermediate arrays.

4. **`.map().filter()` chain producing-then-cleaning undefineds** — `rowSelectionFeature.utils.ts` (`selectRowsFn` `recurseRows`). The `.map` returns `undefined` for unselected rows; the `.filter(x => !!x)` then removes them. Replaced with single push-into-result loop that skips unselected rows. Saves one intermediate array per recursion level.

5. **Smaller `.map().filter()` chains:**
   - `createFacetedRowModel.ts` — `columnFilters?.map(d => d.id).filter(d => d !== columnId)` + outer `.filter(Boolean)` → single loop pushing matching ids.
   - `columnPinningFeature.utils.ts` `column_pin` — `column.getLeafColumns().map(d => d.id).filter(Boolean)` → single loop.

**Why it matters at scale.** In modern V8, `.map`/`.filter` per-iteration overhead is competitive with hand-written loops (~5–15% per element). The win is **eliminating the intermediate arrays themselves**. Each chain stage allocates an array of size N where N is rows/cells/headers. For a 1M-row faceting pass the prior triple-chain in `createFacetedMinMaxValues` allocated ~3 × 8MB of intermediate buffers per faceted column rebuild; the fused version allocates none of those. Across all 5 patterns and all derivation passes (filter, sort, group, facet, pin), this saves tens of MB of allocations and meaningful GC time on cold builds at 1M-row scale.

**Subsumes existing findings:**

- #21 (`createFacetedMinMaxValues` chain) — done as part of pattern 2 above.

**Type-check verified clean** after the fusion sweep.

## Score 7

## 1. `memo()` deps equality uses `.some()` callback per call — Score: 7

**Status:** `[x]` done
**Implementation note:** Replaced the `.some()` callback with an indexed `for` loop + `break` in `src/utils.ts` (memoizedFn body). Drops one closure allocation per memo invocation. Implemented exactly as proposed.

**Location:** `src/utils.ts:136–156`
**Category:** `micro`

`memo()` is the foundation of every memoized accessor on the table, column, row, cell, and header (called _many_ thousands of times per render in a large table). The `.some(callback)` allocates a closure each call and prevents engine inlining of the cheap reference-equality check.

**Before**

```ts
const newDeps = memoDeps?.(depArgs)
const depsChanged =
  !newDeps ||
  newDeps.length !== deps?.length ||
  newDeps.some((dep: any, index: number) => deps?.[index] !== dep)
```

**After**

```ts
const newDeps = memoDeps?.(depArgs)
let depsChanged = !newDeps || newDeps.length !== deps?.length
if (!depsChanged && newDeps) {
  for (let i = 0; i < newDeps.length; i++) {
    if (newDeps[i] !== deps![i]) {
      depsChanged = true
      break
    }
  }
}
```

**Big-O:** No asymptotic change. Constant-factor — one of the most-executed code paths in the library, so worth the few extra lines.

**Scale impact** (closure allocations saved per render — dimension: number of memoized-accessor calls per render across the whole table):

| Calls / render | Closures before | After | Saved / render |
| -------------- | --------------- | ----- | -------------- |
| 1,000          | 1,000           | 0     | 1,000          |
| 10,000         | 10,000          | 0     | 10,000         |
| 100,000        | 100,000         | 0     | 100,000        |
| 1,000,000      | 1,000,000       | 0     | 1,000,000      |

**Risk:** None. Identical semantics.

---

## 12. `centerColumns` filter runs over all leaf columns even when nothing is pinned — Score: 7

**Status:** `[x]` done
**Implementation note:** Original audit proposed converting `left`/`right` arrays to Sets. On reflection that's the wrong fix: pinning in real tables is usually 1–2 cols per side, where `.includes` on a small array beats a Set (no hashing, no extra object allocation, JIT-friendly). The actual win is in the common case where **nothing is pinned at all** — today the function does _all_ the per-side partition work, even with empty pin lists. Refactor: hoist the pin-emptiness check to the top of `table_getHeaderGroups` and bail to `buildHeaderGroups(allColumns, leafColumns, table)` directly. Skips the `getAllLeafColumnsById()` call, two empty-array allocations, two for-loops over empty arrays, the `.filter` pass, and the final 3-way spread.

**Location:** `src/core/headers/coreHeadersFeature.utils.ts:81–134`
**Category:** `micro`

**Before**

```ts
const { left, right } =
  table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
const allColumns = table.getAllColumns()
const leafColumns = callMemoOrStaticFn(
  table,
  'getVisibleLeafColumns',
  table_getVisibleLeafColumns,
)
const leafColumnsById = table.getAllLeafColumnsById()

const leftColumns: typeof leafColumns = []
for (const columnId of left) {
  /* push if visible */
}
const rightColumns: typeof leafColumns = []
for (const columnId of right) {
  /* push if visible */
}

const centerColumns = leafColumns.filter(
  (column) => !left.includes(column.id) && !right.includes(column.id),
)

return buildHeaderGroups(
  allColumns,
  [...leftColumns, ...centerColumns, ...rightColumns],
  table,
)
```

**After**

```ts
const { left, right } =
  table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
const allColumns = table.getAllColumns()
const leafColumns = callMemoOrStaticFn(
  table,
  'getVisibleLeafColumns',
  table_getVisibleLeafColumns,
)

// Fast path: no columns are pinned — skip per-side lookups, partition, and spread.
if (!left.length && !right.length) {
  return buildHeaderGroups(allColumns, leafColumns, table)
}

const leafColumnsById = table.getAllLeafColumnsById()

const leftColumns: typeof leafColumns = []
for (let i = 0; i < left.length; i++) {
  const column = leafColumnsById[left[i]!]
  if (
    column &&
    callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible)
  ) {
    leftColumns.push(column)
  }
}

const rightColumns: typeof leafColumns = []
for (let i = 0; i < right.length; i++) {
  const column = leafColumnsById[right[i]!]
  if (
    column &&
    callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible)
  ) {
    rightColumns.push(column)
  }
}

const centerColumns = leafColumns.filter(
  (column) => !left.includes(column.id) && !right.includes(column.id),
)

return buildHeaderGroups(
  allColumns,
  [...leftColumns, ...centerColumns, ...rightColumns],
  table,
)
```

**Big-O:** Same asymptotic complexity; constant-factor win in the no-pin case (which is most tables). When pinning is active, one extra boolean check at the top — negligible.

**Scale impact** (work saved per `getHeaderGroups()` call when **no columns are pinned**):

| Leaf cols (L) | Before: filter callbacks + spread allocs + 2 empty arrays + `getAllLeafColumnsById()` | After            | Saved             |
| ------------- | ------------------------------------------------------------------------------------- | ---------------- | ----------------- |
| 10            | 10 callbacks + 2 arrays(size 10) + 2 empty arrays + 1 method call                     | 0 (early return) | full work skipped |
| 100           | 100 + 2 arrays(100) + 2 empty + 1 call                                                | 0                | full work skipped |
| 1,000         | 1,000 + 2 arrays(1,000) + 2 empty + 1 call                                            | 0                | full work skipped |
| 10,000        | 10,000 + 2 arrays(10,000) + 2 empty + 1 call                                          | 0                | full work skipped |

**Risk:** None. Behavior unchanged. The `leafColumns` reference is reused (not mutated) when pinning is off — `buildHeaderGroups` reads but does not write to its input array.

---

## 14. `recurseHeadersForSpans` uses `Math.min(...arr)` spread — Score: 7

**Status:** `[x]` done
**Implementation note:** Collapsed `.filter().map()` chain into a single `for…of` loop with `continue` on invisible headers (per project eslint preference for `for…of`). Inlined the inner `.forEach()` over recursive children as a `for…of` loop. Eliminated `Math.min(...childRowSpans)` spread (which would have hit engine arg-count limits on extremely wide header rows) by tracking `minChildRowSpan` inline during the same loop that sums `colSpan`. **Edge-case behavior preserved**: when a header has `subHeaders.length > 0` but none pass visibility (theoretically unreachable given `column_getIsVisible` semantics, but possible by construction), the original code's `Math.min(...[])` returned `Infinity` — the refactor initializes `minChildRowSpan = Infinity` so the empty-children branch naturally produces the same value. Per recursion level: removes 1 filtered array allocation, 1 mapped array allocation, 1 child-rowSpan array allocation, and the spread of that array.

**Location:** `src/core/headers/buildHeaderGroups.ts:143–176`
**Category:** `micro`, `big-o` (stack-overflow risk)

`Math.min(...childRowSpans)` spreads into argument list. With very wide header rows this can blow the argument-count stack limit. Also: this function uses `.filter().map()` which allocates two intermediate arrays per recursion level.

**Before**

```ts
const filteredHeaders = headers.filter((header) =>
  callMemoOrStaticFn(header.column, 'getIsVisible', column_getIsVisible),
)
return filteredHeaders.map((header) => {
  ...
  recurseHeadersForSpans(header.subHeaders).forEach(({ colSpan, rowSpan }) => { ... })
  const minChildRowSpan = Math.min(...childRowSpans)
  ...
})
```

**After**

```ts
const results: Array<{ colSpan: number; rowSpan: number }> = []

for (let i = 0; i < headers.length; i++) {
  const header = headers[i]!
  if (!callMemoOrStaticFn(header.column, 'getIsVisible', column_getIsVisible)) {
    continue
  }

  let colSpan = 0
  let minChildRowSpan = Infinity

  if (header.subHeaders.length) {
    const childSpans = recurseHeadersForSpans(header.subHeaders)
    for (let j = 0; j < childSpans.length; j++) {
      const child = childSpans[j]!
      colSpan += child.colSpan
      if (child.rowSpan < minChildRowSpan) {
        minChildRowSpan = child.rowSpan
      }
    }
  } else {
    colSpan = 1
    minChildRowSpan = 0
  }

  header.colSpan = colSpan
  header.rowSpan = minChildRowSpan

  results.push({ colSpan, rowSpan: header.rowSpan })
}

return results
```

**Big-O:** Removes O(n) intermediate filtered array per recursion + eliminates spread-arg stack risk.

**Scale impact** (intermediate arrays + spread risk — dimension: leaf headers in widest row):

| Headers in widest row | Before (filter+map arrays + spread args) | After          | Saved / risk                            |
| --------------------- | ---------------------------------------- | -------------- | --------------------------------------- |
| 10                    | 2 arrays + 10-arg spread                 | 0 extra arrays | safe range                              |
| 100                   | 2 arrays + 100-arg spread                | 0              | safe range                              |
| 1,000                 | 2 arrays + 1,000-arg spread              | 0              | approaches engine arg-limit (~10k–65k)  |
| 10,000                | 2 arrays + 10,000-arg spread             | 0              | may exceed `Math.min` arg-limit → crash |

**Risk:** None. Same output.

---

## 16. `table_getLeafHeaders` memoDeps call expensive functions to compute deps — Score: 7

**Status:** `[x]` done
**Implementation note:** Initially planned to replace the three cascading `callMemoOrStaticFn(...getLeft/Center/RightHeaderGroups)` calls in `memoDeps` with the six root atoms. On closer inspection the entire pinning branch in the function body was also redundant: `table.getHeaderGroups()` already builds the top row in left → center → right order via `buildHeaderGroups(allColumns, [...leftColumns, ...centerColumns, ...rightColumns], table)`, so the three side-specific getters give the same set of top-row headers as `getHeaderGroups()[0].headers`. Final form collapses to the same pattern as `table_getFooterGroups` / `table_getFlatHeaders`:

```ts
export function table_getLeafHeaders(table) {
  const topHeaders = table.getHeaderGroups()[0]?.headers ?? []
  const result = []
  for (let i = 0; i < topHeaders.length; i++) {
    const leafHeaders = topHeaders[i].getLeafHeaders()
    for (let j = 0; j < leafHeaders.length; j++) {
      result.push(leafHeaders[j])
    }
  }
  return result
}
// in feature:
table_getLeafHeaders: {
  fn: () => table_getLeafHeaders(table),
  memoDeps: () => [table.getHeaderGroups()],
},
```

Eliminates three memoized cascades per call (down to one reference check against the cached header groups), removes the per-call `columnPinning` atom read, and removes the unused imports (`callMemoOrStaticFn`, `table_getLeftHeaderGroups`, `table_getCenterHeaderGroups`, `table_getRightHeaderGroups`, `HeaderGroup` type) from this file.

**Location:** `src/core/headers/coreHeadersFeature.ts:75–94`
**Category:** `memoization`

The `memoDeps` array invokes `getLeftHeaderGroups()` / `getCenterHeaderGroups()` / `getRightHeaderGroups()` _just to compute the dependency tuple_. Those getters are themselves memoized but still force an equality walk every time. Depend on the underlying root atoms instead.

**Before**

```ts
memoDeps: () => [
  callMemoOrStaticFn(table, 'getLeftHeaderGroups', table_getLeftHeaderGroups),
  callMemoOrStaticFn(table, 'getCenterHeaderGroups', table_getCenterHeaderGroups),
  callMemoOrStaticFn(table, 'getRightHeaderGroups', table_getRightHeaderGroups),
],
```

**After**

```ts
memoDeps: () => [table.getHeaderGroups()]
```

**Big-O:** Avoids 3 memo cascades per `getLeafHeaders()` access.

**Scale impact** (memo-cascade triggers saved per call — dimension: `getLeafHeaders()` invocations per session):

| Calls / session | Cascade triggers before (3/call) | After (cheap atom reads) | Saved cascades |
| --------------- | -------------------------------- | ------------------------ | -------------- |
| 10              | 30                               | 0                        | 30             |
| 100             | 300                              | 0                        | 300            |
| 1,000           | 3,000                            | 0                        | 3,000          |
| 10,000          | 30,000                           | 0                        | 30,000         |

**Risk:** Low. Leaf headers are derived from exactly these inputs.

---

## 47. Table-level selection getters not memoized + per-row atom re-reads — Score: 7

**Status:** `[x]` done
**Implementation note:** Several changes landed together (motivated by a profiled hang: a select-all checkbox column over 500k rows re-running selection scans on every virtualizer scroll frame):

- **Memoized the four table getters** `getIsAllRowsSelected`, `getIsAllPageRowsSelected`, `getIsSomeRowsSelected`, `getIsSomePageRowsSelected`, and added a new memoized `getSelectedRowIds` primitive. Previously these had **no `memoDeps`**, and `memo()` with no deps recomputes on _every_ call — so the header "select all" checkbox re-ran an O(filtered-rows) `.some()` scan on every render. Deps are `rowSelection` + the relevant row model (`getFilteredRowModel()` / `getPaginatedRowModel()`), plus `table.options.enableRowSelection` on the three getters that consult `row_getCanSelect`. `getIsSomeRowsSelected` depends on `rowSelection` only (it delegates to `getSelectedRowIds`).
- **Eliminated per-row atom re-reads** in the scans. `isRowSelected` now takes the already-fetched `rowSelection` map as a parameter instead of calling `table.atoms.rowSelection.get()` once per row. The single fetched map is threaded through `getIsAllRowsSelected`, `getIsAllPageRowsSelected`, `selectRowsFn`, and `isSubRowSelected`; the redundant `isRowIdSelected` helper was removed.
- **Routed internal calls through `callMemoOrStaticFn`** so they hit the instance memo, and fixed a key bug: one call site passed the prefixed name `'table_getIsAllPageRowsSelected'`, which never matches the stripped instance method `getIsAllPageRowsSelected`, so it silently fell back to the un-memoized static fn every time.
- **Simplified `getIsSome*`** to "≥1 selected" (delegating to `getSelectedRowIds`). This is a deliberate behavior change from v8's "some but not all" semantics; documented in the migration guides. The three `get*SelectedRowModel` getters reuse the same emptiness short-circuit via `getIsSomeRowsSelected`.
- `RowSelectionState` narrowed to `Record<string, true>` (delete-on-deselect invariant), letting `getSelectedRowIds` use a bare `Object.keys`.
- The originally-proposed `return !preGroupedFlatRows.some(...)` flow tweak was **not** the win and was not adopted; the `let/if/return` shape is retained for the empty-selection short-circuit. Tests added asserting the getters memoize (a `vi.fn` `enableRowSelection` call-count probe) and invalidate on selection change.

**Location:** `src/features/row-selection/rowSelectionFeature.ts:120–155`, `rowSelectionFeature.utils.ts` (`isRowSelected`, `getIsAll*`, `getIsSome*`, `getSelectedRowIds`, `selectRowsFn`)
**Category:** `memoization`, `micro`

```ts
table_getIsAllRowsSelected: {
  fn: () => table_getIsAllRowsSelected(table),
  memoDeps: () => [
    table.atoms.rowSelection?.get(),
    table.getFilteredRowModel(),
    table.options.enableRowSelection,
  ],
},
// getIsAllPageRowsSelected / getIsSomePageRowsSelected: same shape with getPaginatedRowModel()
table_getIsSomeRowsSelected: {
  fn: () => table_getIsSomeRowsSelected(table),
  memoDeps: () => [table.atoms.rowSelection?.get()], // delegates to memoized getSelectedRowIds
},
```

**Big-O:** O(filtered-rows) per call → O(1) until selection or the row model changes. Within the (now memo-gated) first scan, per-row atom reads drop from N to 1.

**Scale impact** (`getIsAllRowsSelected` `.some()` scans saved during scroll/render churn — dimension: renders × filtered rows, selection unchanged):

| Renders × Rows | Scan walks before | After (steady state) | Saved      |
| -------------- | ----------------- | -------------------- | ---------- |
| 10 × 1,000     | 10,000            | 0                    | 10,000     |
| 100 × 10,000   | 1,000,000         | 0                    | 1,000,000  |
| 60 × 100,000   | 6,000,000         | 0                    | 6,000,000  |
| 60 × 500,000   | 30,000,000        | 0                    | 30,000,000 |

**Risk:** Low. Memo deps capture every input the getters read (selection, row model, `enableRowSelection`). The `getIsSome*` semantic change is intentional and documented.

---

## 49. `createSortedRowModel` clones every row before sorting — Score: 7

**Status:** `[x]` done
**Implementation note:** Investigated why the clone existed: the post-sort loop assigns `row.subRows = sortData(row.subRows)`, which would corrupt the source row model if `row` were the original. So the clone is genuinely necessary for **rows with subRows**, but pointless for leaf rows. Refactored: `rows.slice()` produces a sortable array copy (one allocation), the sort runs as before, and the post-sort loop clones only rows where `row.subRows.length > 0`. Leaf rows pass through as their original references. For a flat table (the common case) this drops from N heavy clones to **zero per-row clones** plus one `slice()`. For nested tables, only parent rows are cloned (typically a small fraction of total rows). The native `Array.prototype.sort` is stable since ES2019; the explicit `row.index` tiebreaker was preserved in the comparator for any caller that relied on it.

**Location:** `src/features/row-sorting/createSortedRowModel.ts:81–89`
**Category:** `big-o`, `micro`

```ts
const sortedData = rows.map((row) => {
  const cloned = Object.create(Object.getPrototypeOf(row))
  return Object.assign(cloned, row)
})
```

This allocates N row clones every time the sorted row model rebuilds. `Array.prototype.sort` is stable since ES2019, so the clones are unnecessary. Sort the original references with a tie-break index for stability or rely on engine stability.

**After**

```ts
// If there are sub-rows, sort them. Clone only rows that need mutation
// (i.e. have subRows) so we don't corrupt the source row model.
for (let i = 0; i < sortedData.length; i++) {
  const row = sortedData[i]!
  if (row.subRows.length) {
    // Preserve prototype chain so methods like getValue() remain accessible
    const cloned = Object.create(Object.getPrototypeOf(row))
    Object.assign(cloned, row)
    cloned.subRows = sortData(row.subRows)
    sortedData[i] = cloned
    sortedFlatRows.push(cloned)
  } else {
    sortedFlatRows.push(row)
  }
}

return sortedData
```

**Big-O:** Drops O(n) heavy object allocations per sort.

**Scale impact** (heavy row clones replaced with lightweight `{row, index}` wrappers — dimension: rows sorted per sort pass):

| Rows sorted | Before (full row clones via `Object.create` + `Object.assign`) | After (`{row, index}` wrappers) | Saved                         |
| ----------- | -------------------------------------------------------------- | ------------------------------- | ----------------------------- |
| 10          | 10 heavy clones                                                | 10 small wrappers               | ~10 wide → narrow allocations |
| 100         | 100                                                            | 100                             | ~100                          |
| 1,000       | 1,000                                                          | 1,000                           | ~1,000                        |
| 10,000      | 10,000                                                         | 10,000                          | ~10,000                       |

(Memory is the bigger win than count: each "heavy clone" copies _all_ enumerable fields on a constructed Row, vs `{row, index}` which is 2 fields.)

**Risk:** Behavior depends on whether downstream code mutates the returned rows. The current clone is defensive against mutation. Verify nothing post-sort writes to row instances (the project uses prototype methods, so mutations should not occur).

---

## 50. `column_getAutoSortFn` `slice(10)` should be `slice(0, 10)` (bug) — Score: 7 (bug)

**Status:** `[x]` done
**Implementation note:** One-character fix — `slice(10)` → `slice(0, 10)`. Now correctly samples the first 10 filtered rows for sort-fn auto-detection instead of dropping the first 10 and taking everything after. With ≤10 rows the prior `slice(10)` returned an empty array, so the loop was a no-op and the function silently fell back to the basic/alphanumeric default regardless of actual data types. No existing tests pinned the broken behavior; typecheck clean.

**Location:** `src/features/row-sorting/rowSortingFeature.utils.ts:79–114`
**Category:** `bug`

```ts
const firstRows = column.table.getFilteredRowModel().flatRows.slice(10)
```

This takes rows from index 10 _onwards_, not the first 10. The intent (per the variable name `firstRows`) is the first 10 samples for auto-detection of `sortFn`. With ≤10 rows the array is empty → fallback to alphanumeric sort regardless of actual data types.

**After**

```ts
const firstRows = column.table.getFilteredRowModel().flatRows.slice(0, 10)
```

**Risk:** Changes auto-detected sort fn for tables that have ≥11 rows. Existing tests may need adjustment if they relied on the broken behavior.

---

## 66. A3: updateOffset: batch the per-tick double atom write; skip the commit-sizing loop in onEnd mode — Score: 7

**Status:** `[x]` done
**Implementation note:** Shipped in PR #6367 (47fc97d2f). updateOffset's two writes are wrapped in `table._reactivity.batch` (1 notification flush per tick instead of 2); the `newColumnSizing` commit loop is skipped on onEnd-mode move ticks and the `forEach` became an indexed loop; the drag-end commit+reset sequence is batched (3 flushes → 1). Tests assert the flush counts. Related non-audit work in the same PR, worth recording here: requestAnimationFrame coalescing was added to `header_getResizeHandler` (leading-edge call plus trailing flush per frame) — this was the biggest felt win of the whole resize effort — and lit-table's TableController plus the alpine adapter got selector-based shallow gating of host updates.

**Location:** `packages/table-core/src/features/column-resizing/columnResizingFeature.utils.ts:128–171` (plus `onEnd` at 175–187)
**Category:** `render-path`, `big-o` (short-circuit), `allocation`

Per tick: every pointermove during a drag at 60-120Hz. Three distinct per-tick problems. (a) Missing short-circuit: in the default `columnResizeMode: 'onEnd'`, the `columnSizingStart.forEach` loop computes `newColumnSizing` on EVERY move tick, but the values are only read at commit ('end' or onChange) and are overwritten next tick; for a group-header drag `columnSizingStart` holds an entry per subtree header (up to N), so up to N wasted multiply/round ops per tick. (b) Unbatched writes: in onChange mode, `table_setColumnResizing` and `table_setColumnSizing` fire two separate atom writes per tick → two subscriber notification flushes → potentially two render passes per tick. `table._reactivity.batch` is available and precedented in core (`coreTablesFeature.utils.ts:27, 58`), and grep confirms no `batch` usage exists anywhere under `table-core/src/features/`. The `onEnd` handler is worse: `updateOffset('end', ...)` (2 writes) plus a third `table_setColumnResizing` reset, three unbatched flushes at drag end. (c) Allocations: per tick, one `forEach` callback closure + one destructuring array per entry + one `{...old}` spread. Cross-adapter evidence (from F12's quantification): each of the 2 unbatched writes per tick notifies every `table.store` subscriber; with S row-level `Subscribe` components the per-tick cost is 2 × S × (selector + shallow compare) even though nothing they select changed. Batching this double write is the single highest-leverage fix on the whole tick path.

**Before**

```ts
const updateOffset = (eventType: 'move' | 'end', clientXPos?: number) => {
  if (typeof clientXPos !== 'number') {
    return
  }

  table_setColumnResizing(column.table, (old) => {
    const deltaDirection =
      column.table.options.columnResizeDirection === 'rtl' ? -1 : 1
    const deltaOffset = (clientXPos - (old.startOffset ?? 0)) * deltaDirection
    const startSize = old.startSize ?? 0
    const deltaPercentage = Math.max(
      startSize > 0 ? deltaOffset / startSize : 0,
      -0.999999,
    )

    old.columnSizingStart.forEach(([columnId, headerSize]) => {
      newColumnSizing[columnId] =
        Math.round(
          Math.max(
            headerSize > 0
              ? headerSize + headerSize * deltaPercentage
              : deltaOffset / old.columnSizingStart.length,
            0,
          ) * 100,
        ) / 100
    })

    return {
      ...old,
      deltaOffset,
      deltaPercentage,
    }
  })

  if (
    column.table.options.columnResizeMode === 'onChange' ||
    eventType === 'end'
  ) {
    table_setColumnSizing(column.table, (old) =>
      Object.assign(makeObjectMap<number>(), old, newColumnSizing),
    )
  }
}
```

**After**

```ts
const updateOffset = (eventType: 'move' | 'end', clientXPos?: number) => {
  if (typeof clientXPos !== 'number') {
    return
  }

  const table = column.table
  const isCommit =
    table.options.columnResizeMode === 'onChange' || eventType === 'end'

  table._reactivity.batch(() => {
    table_setColumnResizing(table, (old) => {
      const deltaDirection =
        table.options.columnResizeDirection === 'rtl' ? -1 : 1
      const deltaOffset = (clientXPos - (old.startOffset ?? 0)) * deltaDirection
      const startSize = old.startSize ?? 0
      const deltaPercentage = Math.max(
        startSize > 0 ? deltaOffset / startSize : 0,
        -0.999999,
      )

      if (isCommit) {
        const columnSizingStart = old.columnSizingStart
        for (let i = 0; i < columnSizingStart.length; i++) {
          const entry = columnSizingStart[i]!
          const headerSize = entry[1]
          newColumnSizing[entry[0]] =
            Math.round(
              Math.max(
                headerSize > 0
                  ? headerSize + headerSize * deltaPercentage
                  : deltaOffset / columnSizingStart.length,
                0,
              ) * 100,
            ) / 100
        }
      }

      return {
        ...old,
        deltaOffset,
        deltaPercentage,
      }
    })

    if (isCommit) {
      table_setColumnSizing(table, (old) =>
        Object.assign(makeObjectMap<number>(), old, newColumnSizing),
      )
    }
  })
}
```

And wrap the drag-end sequence (lines 175-187) in one batch so the 'end' commit + reset flush once:

```ts
const onEnd = (clientXPos?: number) => {
  column.table._reactivity.batch(() => {
    updateOffset('end', clientXPos)

    table_setColumnResizing(column.table, (old) => ({
      ...old,
      isResizingColumn: false,
      startOffset: null,
      startSize: null,
      deltaOffset: null,
      deltaPercentage: null,
      columnSizingStart: [],
    }))
  })
}
```

**Big-O:** onChange mode: 2 notification flushes/tick → 1. Scope note (verifier): React 18 already coalesces the two synchronous flushes into one render, so in React/Preact the saving is two subscriber-notification walks → one; the flush-halving of full render passes applies to the store-driven adapters (solid, svelte, vue, lit, angular, alpine, vanilla). onEnd mode (default): eliminates up to |columnSizingStart| float ops + one closure + per-entry destructuring array per tick; drag end 3 flushes → 1. The `Object.assign` O(|sizing|) copy per commit tick remains (required for immutable state identity).

**Risk:** Low-medium. `@tanstack/store@0.11` batch verified nest-safe (batchDepth counter); values apply synchronously inside the batch (functional updaters read fresh state), only notifications coalesce. Behavior change only if a subscriber depended on observing the intermediate `columnResizing` flush before `columnSizing` within one tick. The onEnd-mode skip is unobservable ('end' recomputes all values from absolute positions, not accumulation).
**Verification:** CONFIRMED, with the React-18-coalescing scope amendment and F12's core double-write quantification merged in as cross-adapter evidence.

---

## 73. E1: includesString (auto string filter AND default global filter): add resolveFilterValue, SAFE variant only — Score: 7

**Status:** `[x]` done
**Implementation note:** Added the safe `resolveFilterValue` metadata to `filterFn_includesString` while keeping the function body's `String(filterValue).toLowerCase()` call intact, so direct callers keep identical behavior and row-model callers receive an already-lowercased value. Added focused unit coverage for the resolver metadata. The separate B3/#27 global-filter hoist is still the catalog item that reduces global active-filter resolution from N calls to 1; this entry alone reduces the per-row allocation path and leaves the current per-column global resolution shape unchanged.

**Location:** `packages/table-core/src/fns/filterFns.ts:66–81` (consumed at `createFilteredRowModel.ts:87,107`; default global fn via `globalFilteringFeature.utils.ts:45–47`)
**Category:** `big-o` (short-circuit), `allocation`

Hot path: Per row per filtered rebuild for column filters (R calls per keystroke); per row PER globally-filterable column for global filtering (R × N calls per keystroke; the per-row loop breaks only on first truthy). `String(filterValue).toLowerCase()` is loop-invariant on the filter value but recomputed on every invocation: one case-conversion scan + one string allocation per row (column filter) or per row×column (global filter). At R=100k, N=20 filterable columns, one global-filter keystroke does 2M redundant lowercase allocations. The engine already has the sanctioned hoisting hook: `createFilteredRowModel` applies `filterFn.resolveFilterValue?.(value)` exactly once per filter per rebuild (`filterFn_inNumberRange` already uses this pattern).

**Before**

```ts
export const filterFn_includesString = Object.assign(
  <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValue: unknown,
  ) => {
    return Boolean(
      row
        .getValue(columnId)
        ?.toString()
        .toLowerCase()
        .includes(String(filterValue).toLowerCase()),
    )
  },
  { autoRemove: (val: any) => testFalsy(val) },
)
```

**After**

(SAFE variant only, per verifier: keep the body's `String(filterValue).toLowerCase()` AND add `resolveFilterValue`.)

```ts
export const filterFn_includesString = Object.assign(
  <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValue: unknown,
  ) => {
    return Boolean(
      row
        .getValue(columnId)
        ?.toString()
        .toLowerCase()
        .includes(String(filterValue).toLowerCase()),
    )
  },
  {
    autoRemove: (val: any) => testFalsy(val),
    resolveFilterValue: (val: any) => String(val).toLowerCase(),
  },
)
```

Lowercasing an already-lowercased string hits the V8 no-change fast path (no allocation), so the row-model path keeps most of the win while direct callers (including the unit tests in `tests/unit/fns/filterFns.test.ts`, which invoke fns directly with raw values) keep strictly identical semantics.

**Big-O:** Filter-value string ALLOCATIONS per rebuild: R (or R×N for global) → 1. The safe variant still pays an O(L) no-change lowercase scan per row (allocation eliminated, scan not), and the row-value `.toString().toLowerCase()` per row remains (unavoidable, depends on the row).

**Risk:** None with the safe variant (idempotent for direct calls). Composes with B3: hoist the per-column resolution at line 107, or `resolveFilterValue` runs N times for the global filter.
**Verification:** AMENDED: safe variant only (body-replacing variant would change direct-call semantics and break existing unit tests); demoted 8 → 7 because the no-change lowercase scan remains.

---

## Score 6

## 9. `cell_getContext()` re-allocates the context object on every call — Score: 6

**Status:** `[x]` done
**Implementation note:** Verified resolved in current source by the 2026-07-01 fresh audit: `cell_getContext` is now registered with `memoDeps: (cell) => [cell]` in coreCellsFeature.ts, so the context object is built exactly once per cell instance and the per-render cost is a single-element deps compare.

**Location:** `src/core/cells/coreCellsFeature.utils.ts:51–65`
**Category:** `micro`, `memoization`

Every render that reads `cell.getContext()` (which every framework adapter does for every visible cell) builds a fresh 6-property object. Cells are long-lived; the context is functionally immutable. Cache it on the cell instance.

**Before**

```ts
export function cell_getContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>) {
  return {
    table: cell.table,
    column: cell.column,
    row: cell.row,
    cell: cell,
    // Wrap in arrow functions to preserve `this` binding (methods are on prototype)
    getValue: () => cell.getValue(),
    renderValue: () => cell.renderValue(),
  }
}
```

**After**

```ts
export function cell_getContext(cell) {
  if (!cell._contextCache) {
    cell._contextCache = {
      table: cell.table,
      column: cell.column,
      row: cell.row,
      cell,
      getValue: () => cell.getValue(),
      renderValue: () => cell.renderValue(),
    }
  }
  return cell._contextCache
}
```

**Big-O:** Eliminates one object + two arrow-function allocations per visible cell per access. For a 1000-row × 20-col table that's 20k saved allocations per render.

**Scale impact** (allocations saved per render — 1 object + 2 closures per visible cell read):

| Rows × cols (visible cells) | Allocations before / render | After (post-warmup) | Saved / render |
| --------------------------- | --------------------------- | ------------------- | -------------- |
| 10 × 10 = 100               | 300                         | 0                   | 300            |
| 100 × 20 = 2,000            | 6,000                       | 0                   | 6,000          |
| 1,000 × 50 = 50,000         | 150,000                     | 0                   | 150,000        |
| 10,000 × 100 = 1,000,000    | 3,000,000                   | 0                   | 3,000,000      |

**Risk:** Add `_contextCache?` to the internal Cell type. Safe because cell properties are not mutated post-construction.

---

## 52. `compareAlphanumeric` allocates 2 arrays per comparison — Score: 6

**Status:** `[x]` done
**Implementation note:** Went further than proposed — the audit undercounted the allocations. Besides the two `.filter(Boolean)` arrays per comparison, every chunk-pair iteration allocated and **default-sorted** a fresh `[an, bn]` array (`const combo = [an, bn].sort()`), paying array allocation + sort dispatch + number→string coercion just to classify NaN-ness. Since chunks from `reSplitAlphaNumeric` are either all-digit (`parseInt` always succeeds) or digit-free (`parseInt` always `NaN`), two plain `isNaN` checks replace the combo entirely (`aIsNaN && bIsNaN` → both-string branch, `aIsNaN || bIsNaN` → mixed branch). The `.filter(Boolean)` drop required two semantic guards: (1) empty chunks (which only occur at split-array boundaries) are skipped inline at the top of the loop; (2) the prefix tail return counts only **non-empty** remaining chunks instead of raw `aLen - ai - (bLen - bi)`. Net per comparison: 3+k array allocations → 1 per side (the unavoidable `.split()`), where k = chunk pairs visited. Measured on a 10k-row sort of mixed `itemNNNN-revNN` strings (Node, median of 7 runs): **36.5ms → 20.7ms (~43% faster)**. Equivalence verified two ways: a vocab×vocab differential test against the verbatim old implementation (625 pairs covering boundary digits, leading zeros, pure digits, empties, 30-digit overflow) plus targeted boundary-chunk unit tests, all in `tests/unit/fns/sortFns.test.ts`. Unblocked by #61 — the auto path can now actually select `alphanumeric` again. Follow-up browser stress test on the sorting example with the newer scanner-based alphanumeric changes showed the same order of win: stashed/baseline `table.getSortedRowModel` reruns were **5867.9ms** and **6030.4ms**; applied-change reruns were **3534.6ms** and **3466.6ms**. That is **5949.2ms → 3500.6ms average (~41% faster)** for the two measured hot reruns.

**Location:** `src/fns/sortFns.ts:154–200`
**Category:** `big-o`, `micro`

`aStr.split(re).filter(Boolean)` runs O(n log n) times during a sort (once per comparison). Each call allocates two arrays. Drop the `.filter(Boolean)` by skipping empty pieces inline.

**Before**

```ts
const a = aStr.split(reSplitAlphaNumeric).filter(Boolean)
const b = bStr.split(reSplitAlphaNumeric).filter(Boolean)
```

**After**

```ts
const a = aStr.split(reSplitAlphaNumeric)
const b = bStr.split(reSplitAlphaNumeric)

let ai = 0
let bi = 0
const aLen = a.length
const bLen = b.length

while (ai < aLen && bi < bLen) {
  // Skip the empty boundary chunks that .filter(Boolean) used to remove
  if (!a[ai]) {
    ai++
    continue
  }
  if (!b[bi]) {
    bi++
    continue
  }

  const aa = a[ai++]!
  const bb = b[bi++]!

  // Chunks are either all-digit (parseInt always succeeds) or digit-free
  // (parseInt is always NaN), so NaN-ness fully classifies each chunk
  const an = parseInt(aa, 10)
  const bn = parseInt(bb, 10)

  const aIsNaN = isNaN(an)
  const bIsNaN = isNaN(bn)

  // Both are string
  if (aIsNaN && bIsNaN) {
    if (aa > bb) {
      return 1
    }
    if (bb > aa) {
      return -1
    }
    continue
  }

  // One is a string, one is a number — the string chunk sorts first
  if (aIsNaN || bIsNaN) {
    return aIsNaN ? -1 : 1
  }

  // Both are numbers
  if (an > bn) {
    return 1
  }
  if (bn > an) {
    return -1
  }
}

// One side is exhausted — compare the counts of remaining non-empty chunks
let remaining = 0
for (; ai < aLen; ai++) {
  if (a[ai]) {
    remaining++
  }
}
for (; bi < bLen; bi++) {
  if (b[bi]) {
    remaining--
  }
}
return remaining
```

**Big-O:** Halves array allocations per comparison; total saves O(N log N) intermediate arrays for sort of N rows.

**Scale impact** (intermediate `.filter()` arrays saved across a single sort — dimension: rows sorted, comparisons ≈ N log₂ N, each saves 2 arrays):

| Rows sorted (N) | Comparisons (≈ N log₂ N) | Before arrays (2 × comps) | After arrays (0) | Saved arrays |
| --------------- | ------------------------ | ------------------------- | ---------------- | ------------ |
| 10              | ~33                      | ~66                       | 0                | ~66          |
| 100             | ~664                     | ~1,328                    | 0                | ~1,328       |
| 1,000           | ~9,966                   | ~19,932                   | 0                | ~19,932      |
| 10,000          | ~132,877                 | ~265,754                  | 0                | ~265,754     |

**Risk:** Careful logic — empty-string skipping must mirror the `.filter(Boolean)` semantics exactly.

---

## 54. `filterFn_between` / `filterFn_betweenInclusive` allocate `['', undefined]` per row (broadened by E5: hoist array literals + Number parses) — Score: 6

**Status:** `[x]` done
**Implementation note:** Rewrote both range predicates into explicit blocks. Removed the hot `['', undefined]` literals and `.includes` calls, replaced them with direct endpoint checks, and parsed each endpoint at most once after the lower-bound conjunct passes. This is stricter than the audit sketch because it avoids moving `Number(min/max)` ahead of the first conjunct, preserving the old short-circuit behavior for rows that fail the lower bound. Added direct behavior coverage for exclusive and inclusive boundaries, open endpoints, and reversed-range semantics.

**Location:** `src/fns/filterFns.ts:210–216, 231–237`
**Category:** `micro`

Hoist to a module constant.

**Scale impact** (array allocations saved per filter evaluation — dimension: rows evaluated per filter pass):

| Rows evaluated | Before (2 arrays/row) | After (0) | Saved arrays |
| -------------- | --------------------- | --------- | ------------ |
| 10             | 20                    | 0         | 20           |
| 100            | 200                   | 0         | 200          |
| 1,000          | 2,000                 | 0         | 2,000        |
| 10,000         | 20,000                | 0         | 20,000       |

**Risk:** None.

**2026-07-01 audit (E5, score 6 — full rewrite):** Two fresh 2-element arrays are allocated per row per call (2R allocations per rebuild per between filter) just to test two constants, and `Number(filterValues[0])`/`Number(filterValues[1])` are each parsed up to twice per row, all loop-invariant. Tiny-array `.includes` on state arrays is fine by doctrine, but here the array literal is constructed inside the hot loop.

**After (E5, semantics-identical, no resolveFilterValue needed)**

```ts
const filterFn_between = Object.assign(
  <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValues: [unknown, unknown],
  ): boolean => {
    const min = filterValues[0]
    if (min !== '' && min !== undefined) {
      if (!filterFn_greaterThan(row, columnId, min)) {
        return false
      }
    }

    const max = filterValues[1]
    const numericMin = Number(min)
    const numericMax = Number(max)

    return (
      (!isNaN(numericMin) && !isNaN(numericMax) && numericMin > numericMax) ||
      max === '' ||
      max === undefined ||
      filterFn_lessThan(row, columnId, max)
    )
  },
  {
    autoRemove: (val: any) =>
      testFalsy(val) || (testFalsy(val[0]) && testFalsy(val[1])),
  },
)
```

(same transform for `filterFn_betweenInclusive`)

**Big-O (amended):** 2R array allocations per rebuild → 0; endpoint `Number()` parses inside the fn body 4/row → 2/row (full hoisting to once-per-rebuild folds into #94 / E4).

**Risk (amended):** Very low; pure strength reduction. `['', undefined].includes(x)` ≡ `x === '' || x === undefined` under SameValueZero (no NaN/±0 in the constant set); NaN-propagation and reversed-range semantics preserved verbatim. The implementation preserves the old short-circuit behavior by keeping endpoint parsing after the lower-bound conjunct passes.
**Verification:** CONFIRMED, demoted 7 → 6 (between fns are opt-in; numbers auto-resolve to `inNumberRange`).

---

## 83. F9: Alpine reactive proxy allocates a fresh closure for every method access (per-target fn cache) — Score: 6

**Status:** `[x]` done
**Implementation note:** Shipped in PR #6367 (47fc97d2f). Implementation differs slightly from the proposal: wrapper closures are cached per (target, prop) via a `wrapperCache` WeakMap in packages/alpine-table/src/createTable.ts (the audit proposed a per-target `Map` keyed by the resolved function; the per-target-keyed-by-prop WeakMap variant has the same stable-identity effect and the same no-cross-instance-binding guarantee). Additionally, `createTable(options, selector?)` gained a selector argument that shallow-gates the `_ver` bump so non-selected state writes no longer invalidate templates. Unit tests in alpine-table/tests/unit/selectorGate.test.ts.

**Location:** `packages/alpine-table/src/createTable.ts:93–147` (specifically 127–136)
**Category:** `allocation`

Every property read of the returned table (and, recursively, of every object it returns) in Alpine templates: `table.getRowModel` → `rows` → `row.getAllCells` → `cell.getContext`... per row × column × re-render (`_ver` bump per state write, ×2 per resize tick). `proxyCache` (WeakMap) dedupes OBJECT proxies, but the function wrapper is rebuilt on every single `get` of a method: `row.getValue` accessed once per cell per render allocates a new rest-args closure each time. At R_vis×N = 50k cells with ~3 method reads per cell, ~150k closure allocations per template re-evaluation, per `_ver` bump (2 per resize tick). Rest-args + `Function.apply` is also deopt-prone versus a cached wrapper.

**Before**

```ts
const proxy = new Proxy(value, {
  get(target, prop, receiver) {
    if (prop === '__v_skip') {
      return true
    }

    const resolvedValue = Reflect.get(target, prop, receiver)

    if (typeof resolvedValue === 'function') {
      return (...args: Array<unknown>) => {
        void reactivity._ver
        return toReactiveProxy((resolvedValue as Function).apply(target, args))
      }
    }

    void reactivity._ver
    return toReactiveProxy(resolvedValue)
  },
})
```

**After**

(verifier-corrected design: the cache MUST be per-target, not a global WeakMap. In v9, `assignPrototypeAPIs` puts SHARED functions on row/cell/column prototypes, so a global `WeakMap<Function, Function>` keyed on function identity would bind ALL rows to the first row's `target` (the wrapper closes over `target` for `.apply(target, args)`). Create one fn cache per target alongside each proxy in `toReactiveProxy` (targets are already WeakMap-keyed)):

```ts
// created once per target, next to the proxyCache entry:
const fnCache = new Map<Function, Function>()

const proxy = new Proxy(value, {
  get(target, prop, receiver) {
    if (prop === '__v_skip') return true

    const resolvedValue = Reflect.get(target, prop, receiver)

    if (typeof resolvedValue === 'function') {
      let wrapped = fnCache.get(resolvedValue)
      if (!wrapped) {
        wrapped = function (this: unknown, ...args: Array<unknown>) {
          void reactivity._ver
          return toReactiveProxy(
            (resolvedValue as Function).apply(target, args),
          )
        }
        fnCache.set(resolvedValue, wrapped)
      }
      return wrapped
    }

    void reactivity._ver
    return toReactiveProxy(resolvedValue)
  },
})
```

**Big-O:** Method-access allocations per render: O(cells × methods) → O(distinct methods per target) amortized ~0 after warm-up (worst case ~150k closures/render → ~0).

**Risk:** Function identity across reads changes from "always new" to "stable per target", strictly better for Alpine equality checks. The per-target cache's lifetime is tied to the proxy entry, so no cross-instance binding is possible.
**Verification:** AMENDED: the finder's "methods are per-instance closures" assumption is wrong for v9 prototype-shared APIs; the global-WeakMap design was replaced with a per-target fn cache.

---

## Cross-cutting sweep: `for...of` → indexed `for`

**Status:** `[x]` done

**Adjusted score:** 6  
**Original score:** n/a  
**Score note:** Completed codebase-wide Array iteration micro-optimization sweep.

A codebase-wide conversion of `for (const x of arr)` to `for (let i = 0; i < arr.length; i++) { const x = arr[i]! }` for all `Array` iterations in `packages/table-core/src/**`. Roughly 50 loops touched across ~20 files. Rationale: at TanStack Table's scale targets (millions of rows, thousands of columns) the cumulative micro-cost of iterator-protocol overhead is meaningful — especially on cold-JIT first renders, row-model derivation passes that walk full datasets, and `.find` / pinning loops that run per visible row.

Companion change: **flipped the `@typescript-eslint/prefer-for-of` rule from `'warn'` to `'off'`** at the repo root (`eslint.config.js`) with a comment explaining the rationale. New code should default to indexed `for` for Array iteration. `for...of` is still appropriate for `Map`, `Set`, and generators where indexed access isn't available.

This sweep subsumes the loop-style portions of several individual findings:

- #11 (`table_getAllFlatColumnsById` / `getAllLeafColumnsById` `for...of`)
- #17 (`row_getAllCells` `.map` + `row_getAllCellsByColumnId` `for...of`) — also converted `.map` to a preallocated `new Array(length)` + indexed assignment for `row_getAllCells`.
- #23 (faceted min/max — opportunistically swapped `if/if` for `if/else if` for the redundant max check)

Typecheck verified clean after the sweep (`pnpm tsc --noEmit` passes).

**Bug fix included**: `isNumberArray` had been previously auto-converted by the lint rule into `for (const i of d) { d[i] }` — which treats the iteration _value_ as an index and returns `false` for any non-empty number array. The sweep restores the correct indexed form and the function works again as intended.

**Files changed:**

- `utils.ts` (2 loops)
- `core/cells/constructCell.ts` (1)
- `core/columns/constructColumn.ts` (2)
- `core/columns/coreColumnsFeature.utils.ts` (2)
- `core/headers/buildHeaderGroups.ts` (3)
- `core/headers/constructHeader.ts` (1)
- `core/headers/coreHeadersFeature.utils.ts` (2)
- `core/rows/constructRow.ts` (2)
- `core/rows/coreRowsFeature.utils.ts` (1, plus `.map` → preallocated array)
- `core/table/constructTable.ts` (3)
- `core/table/coreTablesFeature.utils.ts` (1)
- `features/column-faceting/createFacetedMinMaxValues.ts` (1)
- `features/column-faceting/createFacetedRowModel.ts` (1)
- `features/column-faceting/createFacetedUniqueValues.ts` (2)
- `features/column-filtering/createFilteredRowModel.ts` (5)
- `features/column-ordering/columnOrderingFeature.utils.ts` (5)
- `features/column-pinning/columnPinningFeature.utils.ts` (6)
- `features/column-visibility/columnVisibilityFeature.utils.ts` (6)
- `features/row-sorting/createSortedRowModel.ts` (1)
- `features/row-sorting/rowSortingFeature.utils.ts` (1)

## Score 5

## 13. `buildHeaderGroups.findMaxDepth` allocates intermediate filtered arrays — Score: 5

**Status:** `[x]` done
**Implementation note:** Replaced `columns.filter(...).forEach(...)` with an indexed `for` loop + `continue` on invisible columns. Drops one filtered-array allocation per recursion level, two callback closures per call (filter + forEach), and removes the spurious `, 0)` second argument to `forEach` that was being ignored. Implemented as proposed.

**Location:** `src/core/headers/buildHeaderGroups.ts:41–48`
**Category:** `micro`

`.filter(...).forEach(...)` creates throwaway arrays at every depth. Inline the visibility check inside a single indexed loop.

**Before**

```ts
columns
  .filter((column) =>
    callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible),
  )
  .forEach((column) => {
    if (column.columns.length) findMaxDepth(column.columns, depth + 1)
  }, 0)
```

**After**

```ts
for (let i = 0; i < columns.length; i++) {
  const column = columns[i]!
  if (callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible)) {
    if (column.columns.length) {
      findMaxDepth(column.columns, depth + 1)
    }
  }
}
```

**Big-O:** Same. Saves O(n) allocations per recursion level. Also removes the erroneous `, 0` second-arg to `forEach`.

**Scale impact** (intermediate filtered arrays saved — dimension: total header columns walked, one filtered array per recursion level):

| Header tree size   | Filtered arrays before | After | Saved |
| ------------------ | ---------------------- | ----- | ----- |
| 10 (1 level)       | 1                      | 0     | 1     |
| 100 (3 levels)     | 3                      | 0     | 3     |
| 1,000 (4 levels)   | 4                      | 0     | 4     |
| 10,000 (5+ levels) | 5+                     | 0     | 5+    |

(The win here is constant in tree height, not size — the per-recursion filtered array is the entry that gets eliminated.)

**Risk:** None.

---

## 15. `header_getContext()` re-allocates per call — Score: 5

**Status:** `[x]` done
**Implementation note:** Verified resolved in current source by the 2026-07-01 fresh audit: the header context registration now carries `memoDeps: [options.columns]` (coreHeadersFeature.ts:22–25), so the context is cached per header until the column defs change.

**Location:** `src/core/headers/coreHeadersFeature.utils.ts:59–69`
**Category:** `micro`, `memoization`

Mirror of finding #9 for headers.

**Scale impact** (object allocations saved per render — dimension: visible headers × renders that read `header.getContext()`):

| Headers × renders | Before (objs) | After (post-warmup) | Saved   |
| ----------------- | ------------- | ------------------- | ------- |
| 10 × 100          | 1,000         | 10                  | 990     |
| 50 × 1,000        | 50,000        | 50                  | 49,950  |
| 100 × 10,000      | 1,000,000     | 100                 | 999,900 |

**Risk:** Add `_contextCache?` to internal Header type.

---

## 21. `createFacetedMinMaxValues` chains `.map().map().filter()` — Score: 5

**Status:** `[x]` done
**Implementation note:** Fused as part of the loop-fusion sweep (see "Cross-cutting sweep: loop fusion" section near the top). Went further than the original proposal: instead of just collapsing the three `.map().map().filter()` passes into a single `numericValues` loop, the subsequent min/max scan was fused into that same pass too. Net result: one pass over `flatRows`, zero intermediate arrays, inline min/max tracking with `Number.POSITIVE_INFINITY` / `Number.NEGATIVE_INFINITY` seeds and a `foundAny` flag to return `undefined` when no numeric values exist.

**Location:** `src/features/column-faceting/createFacetedMinMaxValues.ts:50–56`
**Category:** `micro`

Three intermediate arrays per faceted column per change. Collapse to a single indexed loop.

**Before**

```ts
const numericValues = flatRows
  .map((flatRow) => flatRow.getValue(columnId))
  .map(Number)
  .filter((value) => !Number.isNaN(value))
```

**After**

```ts
let facetedMinValue = Number.POSITIVE_INFINITY
let facetedMaxValue = Number.NEGATIVE_INFINITY
let foundAny = false

for (let i = 0; i < flatRows.length; i++) {
  const value = Number(flatRows[i]!.getValue(columnId))
  if (Number.isNaN(value)) continue
  foundAny = true
  if (value < facetedMinValue) facetedMinValue = value
  if (value > facetedMaxValue) facetedMaxValue = value
}

if (!foundAny) return undefined
return [facetedMinValue, facetedMaxValue]
```

**Big-O:** O(3n) → O(n) work, 3 array allocations → 1.

**Scale impact** (per faceted column rebuild — dimension: flat rows scanned):

| Flat rows | Before (3 intermediate arrays of ≤n) | After (1 array of ≤n) | Saved arrays |
| --------- | ------------------------------------ | --------------------- | ------------ |
| 10        | 3 of 10                              | 1 of ≤10              | 2 of ~10     |
| 100       | 3 of 100                             | 1 of ≤100             | 2 of ~100    |
| 1,000     | 3 of 1,000                           | 1 of ≤1,000           | 2 of ~1,000  |
| 10,000    | 3 of 10,000                          | 1 of ≤10,000          | 2 of ~10,000 |

**Risk:** None.

---

## 88. B8: Sort comparator does a hashed columnInfoById lookup per comparison per sort column — Score: 5

**Status:** `[x]` done
**Implementation note:** Replaced the per-row-model `columnInfoById` object with a `resolvedSorting` array that carries each sort entry's `id`, `desc`, `sortUndefined`, `invertSorting`, and resolved `sortFn` together. The comparator now reads the resolved entry directly by array index instead of doing `columnInfoById[sortEntry.id]` inside the O(R log R × G) comparison loop. Also hoisted the comparator closure out of `sortData`, so recursive sub-row sorts reuse one comparator for the row-model rebuild instead of allocating one per group. The implementation intentionally keeps the existing `availableSorting` filter and missing-column behavior, leaving the separate unknown-column correctness issue untouched. Added a multi-sort regression covering ordered metadata resolution with `sortUndefined` and `invertSorting`; it also documents the existing behavior that `sortUndefined: 'last'` returns before later sort keys when both compared values are undefined.

**Location:** `packages/table-core/src/features/row-sorting/createSortedRowModel.ts:60–128`
**Category:** `micro`

Hot path: warm O(R log R) path; per state-change: every sort toggle / upstream model change; comparator runs ~R log R times. `sorting` is a tiny array (1-3 entries) so the outer loop is fine, but the string-keyed `columnInfoById[sortEntry.id]` lookup executes once per sort column per comparison: at R=100k that is ~1.7M comparisons × G lookups. The id→info map is built once and only ever read alongside the same `availableSorting[i]` entry; fuse the two structures at construction so the comparator reads array slots only.

**Before**

```ts
  const columnInfoById = makeObjectMap<{...}>()

  availableSorting.forEach((sortEntry) => {
    // ...
    columnInfoById[sortEntry.id] = { ... }
  })

  const sortData = (rows: Array<Row<TFeatures, TData>>) => {
    const sortedData = rows.slice()

    sortedData.sort((rowA, rowB) => {
      for (let i = 0; i < availableSorting.length; i++) {
        const sortEntry = availableSorting[i]!
        const columnInfo = columnInfoById[sortEntry.id]!
        const sortUndefined = columnInfo.sortUndefined
        const isDesc = sortEntry.desc
```

**After**

```ts
  const resolvedSorting: Array<{
    id: string
    desc?: boolean
    sortUndefined?: false | -1 | 1 | 'first' | 'last'
    invertSorting?: boolean
    sortFn: SortFn<TFeatures, TData>
  }> = []

  for (let i = 0; i < availableSorting.length; i++) {
    const sortEntry = availableSorting[i]!
    const column: Column_Internal<TFeatures, TData> | undefined =
      table.getColumn(sortEntry.id)
    if (!column) continue
    resolvedSorting.push({
      id: sortEntry.id,
      desc: sortEntry.desc,
      sortUndefined: column.columnDef.sortUndefined,
      invertSorting: column.columnDef.invertSorting,
      sortFn: column_getSortFn(column),
    })
  }

  // comparator:
      for (let i = 0; i < resolvedSorting.length; i++) {
        const entry = resolvedSorting[i]!
        const sortUndefined = entry.sortUndefined
        const isDesc = entry.desc
        // ...
        sortInt = entry.sortFn(rowA, rowB, entry.id)
```

Also hoist the comparator itself out of `sortData` (it captures only outer-scope values) so recursion over grouped subRows does not allocate a new comparator closure per group.

**Big-O:** ~R log R × G hashed lookups → 0 (~1.7-5M lookups per sort at R=100k, G=1-3; low-ms range). One closure alloc per group removed.

**Risk:** None: same resolution order, same data; `columnInfoById` and `availableSorting` are 1:1 in practice (a missing column would already crash the canSort filter today; see the pre-existing crash note in the correctness section). Fusing also removes that double fetch.
**Verification:** CONFIRMED (1:1 alignment proven; the unknown-column-id crash logged separately as a pre-existing bug).

---

## 89. B16+E13: Faceted factories re-invoked per call, constructing throwaway tableMemo instances — Score: 5

**Status:** `[x]` done
**Implementation note:** Added table-level `_rowModels` caches for per-column faceted row models, unique values, and min/max values, plus single global slots for the three global faceted variants. This preserves each factory's inner memo as the invalidation authority and avoids rebuilding `tableMemo` closures on repeated reads. Added regression coverage that direct static utility calls construct each per-column/global factory only once.

**Location:** `packages/table-core/src/features/column-faceting/columnFacetingFeature.utils.ts:44–56` (also 18–30, 69–81, 94–145), vs. the cached pattern at `src/core/row-models/coreRowModelsFeature.utils.ts:65–75`
**Category:** `memoization`, `allocation`

Hot path: per state-change: every faceted deps-change per faceted column; per call in the no-prototype fallback. `table.options.features.facetedRowModel` is the factory from `createFacetedRowModel()`; each invocation builds a brand-new `tableMemo` (memo closure, debug-name parsing in dev, scheduling wiring) whose single-slot cache is used exactly once and discarded, so its memoization is structurally dead. The filtered/sorted/grouped models avoid this by caching the constructed memo in `table._rowModels`. On the registered-feature path the column prototype memo caches results, hiding the cost as "factory + tableMemo construction per deps-change per faceted column". In the fallback path (facet factories registered without `columnFacetingFeature`), every single call performs a full O(R) recompute. Same pattern for `column_getFacetedMinMaxValues`, `column_getFacetedUniqueValues`, and the three `table_getGlobalFaceted*` fns.

**Before**

```ts
export function column_getFacetedRowModel<...>(
  column: ...,
  table: Table_Internal<TFeatures, TData>,
): RowModel<TFeatures, TData> {
  const facetedRowModelFn =
    table.options.features.facetedRowModel?.(table, column?.id ?? '') ??
    (() => table.getPreFilteredRowModel())
  return facetedRowModelFn()
}
```

**After**

(B16's table-level `_rowModels`-style cache, preferred over E13's on-column cache because it covers the three global variants and matches existing typing)

```ts
export function column_getFacetedRowModel<...>(column, table): RowModel<TFeatures, TData> {
  const columnId = column?.id ?? ''
  const cache = (table._rowModels.facetedRowModels ??= makeObjectMap())
  let facetedRowModelFn = cache[columnId]
  if (!facetedRowModelFn) {
    facetedRowModelFn = cache[columnId] =
      table.options.features.facetedRowModel?.(table, columnId) ??
      (() => table.getPreFilteredRowModel())
  }
  return facetedRowModelFn()
}
```

(plus `facetedUniqueValues`/`facetedMinMaxValues` maps and the three global variants cached as single slots; extend the `CachedRowModels` types accordingly.)

**Big-O:** Registered path: one factory + tableMemo construction (several closures + dev string work) saved per deps-change per faceted column. Fallback path: repeated full O(R) recomputes per call → memoized (at R=100k with a facet dropdown read per render, ~10ms/render → ~0).

**Risk:** The cache is keyed by columnId, scaling with N (doctrine-compliant). Cache lifetime matches `_rowModels` (never reset; must not outlive `table.options.features` swaps, same invariant as filtered/sorted). The inner memo becoming long-lived makes its own memoDeps the invalidation authority; the dep set is identical to the prototype memo, so results stay coherent.
**Verification:** MERGED (B16 ≡ E13; B16 formulation kept), demoted 6 → 5: on the registered path the outer prototype memo already caches results, so the win there is construction allocations only; the O(R)-per-call fallback is real but requires a specific misconfiguration.

---

## 95. E6: filterFn_equalsString lowercases the filter value per row — Score: 5

**Status:** `[x]` done
**Implementation note:** Added the safe `resolveFilterValue` metadata to `filterFn_equalsString` while keeping the function body's `String(filterValue).toLowerCase()` call intact. Row-model filtering now receives a lowercased value once per rebuild, and direct callers keep identical behavior because the body remains idempotent. Added focused resolver metadata coverage alongside the existing `equalsString` behavior tests.

**Location:** `packages/table-core/src/fns/filterFns.ts:89–101`
**Category:** `big-o` (short-circuit), `allocation`

Hot path: per row per filtered rebuild (R calls). Identical shape to E1: `String(filterValue).toLowerCase()` is loop-invariant, costing one allocation + case scan per row.

**Before**

```ts
return (
  row.getValue(columnId)?.toString().toLowerCase() ===
  String(filterValue).toLowerCase()
)
```

**After**

Add `resolveFilterValue: (val: any) => String(val).toLowerCase()` and keep the body idempotent (E1's safe variant), so direct callers are unaffected.

**Big-O:** R filter-value string allocations per rebuild → 1.

**Risk:** Same direct-call analysis as E1; the safe variant is fully behavior-preserving. Cooler path than E1 (`equalsString` is registry-selected, not the auto default).
**Verification:** CONFIRMED (same safety analysis as E1's safe variant).

---

## Score 4

## 17. `row_getAllCells` / `row_getAllCellsByColumnId` use `.map`/`for...of` — Score: 4

**Status:** `[x]` done
**Implementation note:** Converted as part of the codebase-wide `for...of` → indexed `for` sweep. `row_getAllCells` `.map` was additionally replaced with a preallocated `new Array(columns.length)` + indexed assignment (avoids `.push` reallocation overhead). See the "Cross-cutting sweep" section near the top of this doc.

**Location:** `src/core/rows/coreRowsFeature.utils.ts:163–191`
**Category:** `micro`

Swap `.map()` and `for...of` for indexed loops. Called for every row in the row model whenever cells are read.

**Scale impact** (iterator/callback overhead saved — dimension: cells iterated when row cell collections are built):

| Rows × cols (cells)      | Before (callback/iterator overhead per cell) | After (indexed access) | Saved overhead per pass |
| ------------------------ | -------------------------------------------- | ---------------------- | ----------------------- |
| 10 × 10 = 100            | 100 callback invokes                         | 0                      | 100                     |
| 100 × 20 = 2,000         | 2,000                                        | 0                      | 2,000                   |
| 1,000 × 50 = 50,000      | 50,000                                       | 0                      | 50,000                  |
| 10,000 × 100 = 1,000,000 | 1,000,000                                    | 0                      | 1,000,000               |

**Risk:** None.

---

## 39. `row_getVisibleCells` builds Sets for the small `left`/`right` arrays — Score: 4

**Status:** `[x]` done
**Implementation note:** Original audit proposed a single-pass partition iterating `allCells` directly and dispatching each cell to left/center/right via Set membership. On review that's incorrect: it would push pinned cells in **cell order** rather than **pin order**, changing user-visible behavior (pinning column B then A should display B, A). The existing per-side loop honors pin order correctly. The consistency win available here, matching the approach in #12, is to drop the `leftSet`/`rightSet` allocations used for the center-cell partition and use `.includes()` on the small `left`/`right` arrays directly.

Additional refactor on top: the per-call `cellsByColumnId` local Map was promoted to a new memoized row API, `row.getVisibleCellsByColumnId()` (returns `Record<string, Cell>` with narrower deps `[row.getAllCells(), columnVisibility]` — pinning doesn't invalidate it). Inside `row_getVisibleCells`, the pinned path now reads from this memoized record instead of building a fresh Map per call.

**Do not "optimize" by deriving `visibleCells` from `Object.values(visibleCellsByColumnId)`.** `Object.values()` returns integer-index-like string keys (e.g. `"0"`, `"1"`, `"42"`) first in ascending numeric order, regardless of insertion order. Column IDs come from `accessorKey`, so a user with numeric-string accessor keys (`"2"`, `"10"`, `"1"`) would see their cell order reorder after a round-trip. The Record is safe for bracket-lookup (`record[columnId]`) but unsafe for ordered iteration. Keep `visibleCells` built directly from `row.getAllCells()` to preserve leaf-column order.

**Location:** `src/features/column-visibility/columnVisibilityFeature.utils.ts:157–166`
**Category:** `micro`

**Before**

```ts
// Center cells: visible cells in natural column order, minus pinned ones.
const leftSet = new Set(left)
const rightSet = new Set(right)
const centerCells: Array<Cell<...>> = []
for (const cell of cells) {
  const id = cell.column.id
  if (!leftSet.has(id) && !rightSet.has(id)) centerCells.push(cell)
}
```

**After**

```ts
// Center cells: visible cells in natural column order, minus pinned ones.
const centerCells: Array<Cell<TFeatures, TData, unknown>> = []
for (let i = 0; i < visibleCells.length; i++) {
  const cell = visibleCells[i]!
  const id = cell.column.id
  if (!left.includes(id) && !right.includes(id)) centerCells.push(cell)
}
```

**Big-O:** Same asymptotic complexity; constant-factor win at typical pin counts. With P_l = P_r = 2, `.includes()` is ~4 reference comparisons per cell vs Set hashing + bucket traversal + an upfront Set allocation per side per row.

**Scale impact** (Set object allocations saved per pinned row — dimension: rows that hit the pinned path per render):

| Rows with pinning active per render | Set allocs before (2 per row) | After | Saved Sets |
| ----------------------------------- | ----------------------------- | ----- | ---------- |
| 10                                  | 20                            | 0     | 20         |
| 100                                 | 200                           | 0     | 200        |
| 1,000                               | 2,000                         | 0     | 2,000      |
| 10,000                              | 20,000                        | 0     | 20,000     |

(For very heavily pinned tables — P > ~8 per side — Sets would start to pay off again. Reconsider if a user reports that case.)

**Risk:** None. Output is byte-identical for the typical small-P case; ordering is preserved (Map handles left/right order, center remains in cell order).

---

## 48. `selectRowsFn` spreads row object even when subRows did not change — Score: 4

**Status:** `[x]` done
**Implementation note:** Implemented a **reframed fix** — the proposed `newSubRows !== row.subRows` check is dead on arrival: `recurseRows` allocates a fresh `result` array on every call and returns it unconditionally, so the reference is _always_ different and the check could never skip a clone. (The scale table's premise is also inverted: an unmatched subtree returns `[]`, never the original reference.) The real waste in the same lines: the clone ran for **every** row with subRows, but unselected rows are never pushed to `result` — so their clone was allocated and immediately discarded. Fix: recurse unconditionally (required — selected descendants of unselected parents must still be collected into `flatRows`/`rowsById`), then build the clone only when `isSelected`. Under sparse selection on hierarchical data this eliminates nearly all clones. **Bug fix included:** rows are `Object.create(rowPrototype)` instances, but the old clone was a plain spread `{ ...row, subRows }` — which drops the prototype, so cloned parent rows in the selected row models lost all their prototype APIs (`getValue()`, etc.). The clone now uses the #49 precedent: `Object.assign(Object.create(Object.getPrototypeOf(row)), row)` + `subRows` assignment. Added regression tests (selected child under unselected parent; prototype-method survival on cloned parents) in `tests/implementation/features/row-selection/rowSelectionFeature.test.ts` — the existing suite only covered selected-child-under-selected-parent and would not have caught a recursion-skipping mistake.

**Location:** `src/features/row-selection/rowSelectionFeature.utils.ts:618–658`
**Category:** `micro`

If the recursive `recurseRows(row.subRows)` returns the same reference, skip the spread:

```ts
if (newSubRows !== row.subRows) row = { ...row, subRows: newSubRows }
```

**Big-O:** Same. Saves O(depth × n) shallow clones when nothing in a subtree matched.

**Scale impact** (row spread allocations skipped when subtree unchanged — dimension: parent rows with subrows × renders where selection didn't change them):

| Parent rows with subrows | Skip-clone renders | Before clones | After clones | Saved       |
| ------------------------ | ------------------ | ------------- | ------------ | ----------- |
| 10                       | 10                 | 100           | 0            | 100         |
| 100                      | 100                | 10,000        | 0            | 10,000      |
| 1,000                    | 1,000              | 1,000,000     | 0            | 1,000,000   |
| 10,000                   | 10,000             | 100,000,000   | 0            | 100,000,000 |

**Risk:** Need to confirm the recursion never mutates `row.subRows` in-place. (It does construct a new filtered array, so the reference will differ when results differ.)

---

## 55. `filterFn_arrHas` and `filterFn_arrIncludesAll` use `.some()` (broadened by E7: hoist getValue + classic loops) — Score: 4

**Status:** `[x]` done
**Implementation note:** Replaced `.some()` callbacks in `arrHas`, `arrIncludes`, `arrIncludesAll`, and `arrIncludesSome` with indexed loops and early returns. Also hoisted `row.getValue(columnId)` once per filter function call for `arrHas` and `arrIncludes`, matching the broadened E7 audit. Added direct behavior tests for all four array filters, including `getValue` call-count checks for the hoisted paths and non-array fallback coverage for the all/some variants.

**Location:** `src/fns/filterFns.ts:287–296, 321–332`
**Category:** `micro`

Replace with indexed `for` loops with early `return`. Removes closure-per-row.

**Scale impact** (closure allocations saved per filter evaluation — dimension: rows evaluated):

| Rows evaluated | Before (`.some` closures) | After | Saved closures |
| -------------- | ------------------------- | ----- | -------------- |
| 10             | 10                        | 0     | 10             |
| 100            | 100                       | 0     | 100            |
| 1,000          | 1,000                     | 0     | 1,000          |
| 10,000         | 10,000                    | 0     | 10,000         |

**Risk:** None.

**2026-07-01 audit (E7, score 4 — broadened):** Beyond the closure-per-row (R per rebuild), `row.getValue(columnId)` is re-invoked once per filter-value element (V times) instead of once, across `arrHas`, `arrIncludes`, and the loops in `arrIncludesAll`/`arrIncludesSome` (`src/fns/filterFns.ts:299–358`). Fix: hoist `getValue` once per call, classic loop over the filter values with early return. `getValue` is cache-stable within a rebuild, so this is observationally identical.
**Verification:** Verified (2026-07-01 audit).

---

## 104. E10: column_getAutoFilterFn's Array.isArray branch is unreachable (bug) — Score: 4 (bug)

**Status:** `[x]` done
**Implementation note:** Moved the `Array.isArray(value)` branch before the generic non-null object branch in `column_getAutoFilterFn`, matching the function's documented behavior that array-valued columns use `arrIncludes`. Added focused auto-filter selection tests covering array values (`arrIncludes`) and plain object values (`equals`) so the branch order stays locked.

**Location:** `packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts:62–68`
**Category:** `bug`

Arrays satisfy `typeof value === 'object'`, so the `equals` branch always wins and the documented behavior ("arrays use `arrIncludes`", per the fn's own docstring at lines 29-31) never happens: array-valued auto-filter columns silently get `===` filtering, which essentially never matches.

**Before**

```ts
if (value !== null && typeof value === 'object') {
  return filterFns?.equals
}

if (Array.isArray(value)) {
  return filterFns?.arrIncludes
}
```

**Fix:** Swap the two branches (`Array.isArray` first).

**Risk:** Behavior change is from-broken-to-documented; flag in the changeset.
**Verification:** CONFIRMED-BUG, severity MODERATE.

---

## 133. E9: aggregationFns reduce/forEach closures; dead null checks in min/max/extent — Score: 4

**Status:** `[x]` done
**Implementation note:** Replaced `reduce`/`forEach` in `sum`, `min`, `max`, `extent`, and `mean` with indexed loops. Removed the redundant `value != null` checks from `min`/`max`/`extent` while keeping mean's load-bearing nullish check before numeric coercion. Added focused aggregation function tests for sum behavior, min/max/extent NaN seeding stickiness, ignored non-number values, and mean's nullish handling.

**Location:** `packages/table-core/src/fns/aggregationFns.ts:11–150` (sum, min, max, extent, mean)
**Category:** `micro`

`.reduce`/`.forEach` closures run per group per rebuild; `value != null` is dead before `typeof value === 'number'` in `min`/`max`/`extent` (mean's null check is load-bearing, keep it).

**Fix:** Classic loops, with NaN-seeding stickiness preserved exactly.

**Risk:** Do not remove `mean`'s null check when cleaning up `min`/`max`/`extent`'s dead checks — it is load-bearing there, unlike the others. NaN-seeding stickiness must be preserved exactly across all five functions.
**Verification:** Verified (2026-07-01 audit).

---

## Score 3

## 53. `sortFn_datetime` compares mixed Date / string / number — Score: 3

**Status:** `[x]` done
**Implementation note:** Added a small `toDateSortValue` helper so `sortFn_datetime` normalizes `Date` instances to `getTime()` before the existing relational comparison. Non-Date values still flow through unchanged, preserving string fallback comparisons and numeric timestamp behavior. Added datetime sort tests for Date/timestamp mixed comparisons, string fallback ordering, and invalid Date equality-like behavior.

**Location:** `src/fns/sortFns.ts:99–114`
**Category:** `micro`

Normalize `Date` → `getTime()` once at the top, then compare numbers (or fall through to `>/<` for strings). Marginal but the comparator runs O(n log n) times.

**Risk:** None when only used for true datetime columns. Verify mixed-type columns don't rely on coercion.

---

## 18. `table_getRow` always calls `getCoreRowModel()` — Score: 3

**Status:** `[x]` done
**Implementation note:** Verified resolved in current source by the 2026-07-01 fresh audit: `table_getRow` now does an O(1) `rowsById[rowId]` lookup on getRowModel/getPrePaginatedRowModel and falls back to the core row model only on a miss (coreRowsFeature.utils.ts:241–264).

**Location:** `src/core/rows/coreRowsFeature.utils.ts:228–251`
**Category:** `micro`

When the row exists in the primary row model (common case), skip the fallback fetch.

**Before**

```ts
let row = (searchAll ? table.getPrePaginatedRowModel() : table.getRowModel())
  .rowsById[rowId]

if (!row) {
  row = table.getCoreRowModel().rowsById[rowId]
  if (!row) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`getRow could not find row with ID: ${rowId}`)
    }
    throw new Error()
  }
}

return row
```

**After**

```ts
const primary = (searchAll ? table.getPrePaginatedRowModel() : table.getRowModel()).rowsById[rowId]
if (primary) return primary
const core = table.getCoreRowModel().rowsById[rowId]
if (core) return core
...
```

**Risk:** None.

---

## 22. `createFacetedUniqueValues` redundant `Map.has` before `Map.set` — Score: 3

**Status:** `[x]` done
**Implementation note:** Replaced `has` + `get` + `set` with one `get` and one `set`, using `previousValue === undefined` as the miss sentinel because stored counts are always numbers. Added faceted unique-values coverage with an `undefined` facet key to lock in the sentinel behavior.

**Location:** `src/features/column-faceting/createFacetedUniqueValues.ts:46–62`
**Category:** `micro`

`set(k, (get(k) ?? 0) + 1)` works in either branch.

**Scale impact** (Map ops saved per facet rebuild — dimension: distinct value encounters):

| Value occurrences | Before (`has` + `get` + `set`) | After (`get` + `set`) | Saved Map ops |
| ----------------- | ------------------------------ | --------------------- | ------------- |
| 10                | 30                             | 20                    | 10            |
| 100               | 300                            | 200                   | 100           |
| 1,000             | 3,000                          | 2,000                 | 1,000         |
| 10,000            | 30,000                         | 20,000                | 10,000        |

**Risk:** None.

**2026-07-01 audit (B18, score 3):** Re-verified and sharpened: `has` + `get` + `set` is 3 hashed Map ops per value on the hit path (the Map itself is correct here — R-scaling key space, not a tiny state array). Proposed form: `const prev = map.get(v); map.set(v, prev === undefined ? 1 : prev + 1)` — safe because stored counts are always numbers, so `prev === undefined` ⟺ miss.
**Verification:** Verified (2026-07-01 audit).

---

## 46. `table_toggleAllRowsSelected` clones entire selection on deselect — Score: 3

**Status:** `[~]` partial

**Adjusted score:** 2  
**Original score:** 3  
**Score note:** Opt-in partial improvement landed.
**Implementation note:** Added an opt-in `opts.deselectAll` argument to `table_toggleAllRowsSelected` / `table_toggleAllPageRowsSelected`. When the resolved value is a deselect and `deselectAll` is set, the function returns a fresh empty map in O(1) instead of spreading `old` and `delete`-ing each id. The default path is intentionally unchanged (spread + per-id delete) because an unconditional `{}` return is a **breaking** behavior change — it also drops selected ids that are absent from the current pre-grouped model (e.g. filtered-out rows), which v8 preserved. So the spread/delete cost is only avoided when the caller opts in. Tests added in `rowSelectionFeature.test.ts` (`deselectAll: true` clears an out-of-model id; default preserves it). The behavior change is noted in the framework migration guides.

**Location:** `src/features/row-selection/rowSelectionFeature.utils.ts:78–107`
**Category:** `micro`

When deselecting all, the function spreads `old`, then `delete`s every row id. Just return `{}` (or a fresh map of forced-selected ids) without the spread.

**Scale impact** (per deselect-all action — dimension: prior selection size):

| Prior selections | Before (spread + delete per row) | After (return `{}`) | Saved ops  |
| ---------------- | -------------------------------- | ------------------- | ---------- |
| 10               | 1 spread + 10 deletes            | 0                   | 11 ops     |
| 100              | 1 spread + 100 deletes           | 0                   | 101 ops    |
| 1,000            | 1 spread + 1,000 deletes         | 0                   | 1,001 ops  |
| 10,000           | 1 spread + 10,000 deletes        | 0                   | 10,001 ops |

**Risk:** None.

---

## 57. `aggregationFn_median` full sorts for the median — Score: 3

**Status:** `[~]` partial

**Adjusted score:** 2  
**Original score:** 3  
**Score note:** Map/validation fusion landed; quickselect was skipped.
**Implementation note:** The quickselect-vs-sort question (the headline of this finding) was **not** addressed — `.sort()` is still used because quickselect adds ~50 LOC of complexity that isn't justified without profiling evidence that median is hot for very large groups. The smaller win **was** captured though: fused `.map((row) => row.getValue(columnId))` with the previous `isNumberArray(values)` validation pass into a single loop that extracts values into a preallocated array and bails immediately on the first non-number. Removes one full walk over the values array per call. The full-sort cost remains.

**Location:** `src/fns/aggregationFns.ts:156–166`
**Category:** `big-o`

Median requires only the middle element; quickselect is O(n) average vs `.sort()` O(n log n). Worth it only for large groups; skip otherwise to keep bundle slim.

**Risk:** Quickselect adds bytes and complexity. Recommend leaving as-is unless real-world data shows hot.

---

## 136. E15: includesStringSensitive / equalsStringSensitive: String(filterValue) per row — Score: 3

**Status:** `[x]` done
**Implementation note:** Added safe `resolveFilterValue` metadata to both case-sensitive string filters: `filterFn_includesStringSensitive` and `filterFn_equalsStringSensitive`. The function bodies still call `String(filterValue)`, so direct-call behavior stays identical; row-model filtering receives a stringified value once per rebuild. Added focused resolver metadata coverage for both filters.

**Location:** `packages/table-core/src/fns/filterFns.ts:47–58, 108–117` (`includesStringSensitive`, `equalsStringSensitive`)
**Category:** `micro`

`String(filterValue)` runs per row, allocating for non-string filter values.

**Fix:** `resolveFilterValue: (val) => String(val)`; `String(String(v))` is identity, so this is fully safe even for direct callers.

**Risk:** None noted; the fix is provably safe since `String(String(v))` is identity.
**Verification:** Verified (2026-07-01 audit).

---

## Score 2

## 11. `table_getAllFlatColumnsById` / `getAllLeafColumnsById` use `for...of` — Score: 2

**Status:** `[x]` done
**Implementation note:** Converted as part of the codebase-wide `for...of` → indexed `for` sweep. See the "Cross-cutting sweep" section near the top of this doc.

**Location:** `src/core/columns/coreColumnsFeature.utils.ts:175–186, 224–235`
**Category:** `micro`

Swap `for...of` for indexed loops to drop iterator protocol overhead. Cheap, but called every time the column structure is rebuilt.

**Scale impact** (iterator protocol overhead saved per column-structure rebuild — dimension: columns):

| Columns | Iterator calls before | After (indexed) | Saved iterator calls |
| ------- | --------------------- | --------------- | -------------------- |
| 10      | 10                    | 0               | 10                   |
| 100     | 100                   | 0               | 100                  |
| 1,000   | 1,000                 | 0               | 1,000                |
| 10,000  | 10,000                | 0               | 10,000               |

**Risk:** None.

---

## 58. `aggregationFn_unique` + `aggregationFn_uniqueCount` rebuild Set twice — Score: 2

**Status:** `[~]` partial

**Adjusted score:** 1  
**Original score:** 2  
**Score note:** Per-call fusion landed; cross-function sharing was skipped.
**Implementation note:** The cross-function memoization the original finding proposed (sharing a Set between `aggregationFn_unique` and `aggregationFn_uniqueCount` when both run on the same column in the same pass) was **not** implemented — the use case is rare enough that it's not worth the API plumbing. The per-call fusion **was** captured though: both functions now iterate `leafRows` directly into a Set instead of building an intermediate Array via `.map` and then constructing the Set from it. Saves one Array allocation of size `leafRows.length` per call.

**Location:** `src/fns/aggregationFns.ts:172–193`
**Category:** `memoization`

Only useful if both are called on the same column in the same aggregation pass. Not a common pattern; skip unless a consumer hits it.

**Risk:** None.

---

## Score 1

## 5. `isNumberArray()` uses `.every()` — Score: 1

**Status:** `[x]` done
**Implementation note:** Replaced `.every()` callback with an indexed `for` loop + early `return false`. Semantics preserved (empty array still returns `true`, matching the original `.every()` behavior). Drops one closure allocation per call.

**Location:** `src/utils.ts:79–81`
**Category:** `micro`

Replace with an indexed loop and early exit. Low frequency; only used during sort-fn auto-detection.

**Risk:** None.

---

## 23. Faceted min/max loop comparisons — Score: 1

**Status:** `[x]` done
**Implementation note:** `if/if` swapped for `if/else if` (skips the max comparison when min was a hit). Also loop start moved to `i = 1` since `numericValues[0]` is used to seed both `facetedMinValue` and `facetedMaxValue`. Done as part of the `for...of` → indexed `for` sweep.

**Location:** `src/features/column-faceting/createFacetedMinMaxValues.ts:59–65`
**Category:** `micro`

`if (...) ... else if (...)` instead of two unconditional ifs. Tiny.

**Risk:** None.

---

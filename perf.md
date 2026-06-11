# `@tanstack/table-core` — Performance Refactor Catalog

A code-level audit of `packages/table-core/src/**`. Each entry describes a concrete, low-risk refactor that preserves the public API surface and the shape of `table.getState()`. New `get*` APIs are allowed, but bundle-size discipline is in scope.

## Legend

- **Categories:** `big-o` · `memoization` · `micro` · `bundle-size` · `bug`
- **Score (1–10):** importance after considering hot-path frequency, magnitude of win, and risk.
  - `10` = library-wide hot path, big-O improvement
  - `7–9` = clear win in a frequently-called path (memoization gap, O(n²)→O(n))
  - `4–6` = noticeable but bounded (micro in a frequent path, or memo in cold path)
  - `1–3` = micro-opt with negligible runtime, mostly cleanup
- **Scale impact tables:** counts of _operations / allocations / comparisons saved_, not wall time. Numbers are illustrative — they assume realistic ratios (e.g. pinned ≈ 10% of leaf cols, average `.find` walks ½ the array) and are meant to communicate _order of magnitude_ across table sizes. Bugs and fixed-cost refactors (one-time initialization, correctness fixes) don't get tables.
- **Status convention:** every finding has a `**Status:**` line and an `**Implementation note:**` line near the top.
  - `[ ]` not started — untouched
  - `[~]` partial — applied, but with deviation or scope reduction (note required)
  - `[x]` done — refactored as suggested
  - `[-]` skipped — deliberately not pursued (note required)

  Fill in the implementation note when status changes from `[ ]`, with: PR/commit ref if relevant, any deviation from the proposed code, before/after benchmark numbers if measured, and follow-ups.

## Cross-cutting sweep: loop fusion (`.map().flat()`, `.map().filter()`, `.map().map().filter()`)

**Status:** `[x]` done

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

## Cross-cutting sweep: `for...of` → indexed `for`

**Status:** `[x]` done

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

## Progress

- **Total findings:** 61
- **Done `[x]`:** 20
- **Partial `[~]`:** 2
- **Skipped `[-]`:** 5
- **Not started `[ ]`:** 34

_(Update these counters as you go.)_

---

# Cross-cutting (`utils.ts`, helpers, reactivity, flex-render)

These are touched by every feature — wins compound.

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

## 2. `assignPrototypeAPIs` allocates wrapper closures on every call — Score: 6

**Status:** `[-]` skipped
**Implementation note:** Re-examination of `utils.ts:407–421` showed the original audit misread the code. The two arrow-function wrappers (`memoDeps:` and `fn:`) live inside the `if (!this[memoKey])` block, so they're allocated **once per instance per method**, not per call. Subsequent calls just delegate via `return this[memoKey](...args)`. Removing the `const self = this` alias in favor of capturing `this` lexically saves nothing measurable (it's a stack alias, not a heap allocation) and may even cost slightly more due to lexical-`this` lookup. No win to capture here.

**Location:** `src/utils.ts:402–416`
**Category:** `micro`, `memoization`

Each call to a memoized prototype method (`column.getIsVisible()`, `row.getVisibleCells()`, `header.getSize()`, …) re-creates _two_ arrow functions (`memoDeps`/`fn` wrappers) every call after the lazy init. Pull them out so they're allocated once per prototype, not once per call.

**Before**

```ts
prototype[fnKey] = function (this: any, ...args: Array<any>) {
  if (!this[memoKey]) {
    const self = this
    this[memoKey] = tableMemo({
      memoDeps: (depArgs) => memoDeps(self, depArgs),
      fn: (...deps) => fn(self, ...deps),
      ...
    })
  }
  return this[memoKey](...args)
}
```

**After**

```ts
prototype[fnKey] = function (this: any, ...args: Array<any>) {
  if (!this[memoKey]) {
    this[memoKey] = tableMemo({
      memoDeps: (depArgs) => memoDeps(this, depArgs),
      fn: (...deps) => fn(this, ...deps),
      ...
    })
  }
  return this[memoKey](...args)
}
```

(The two closures still capture `memoDeps`/`fn`; the win is dropping the `self` alias and ensuring the closures live inside the one-time init path.)

**Big-O:** Saves 1 allocation per memoized call after init.

**Scale impact** (`self` alias allocations saved — dimension: memoized accessor invocations after init):

| Invocations | Before    | After | Saved     |
| ----------- | --------- | ----- | --------- |
| 1,000       | 1,000     | 0     | 1,000     |
| 10,000      | 10,000    | 0     | 10,000    |
| 100,000     | 100,000   | 0     | 100,000   |
| 1,000,000   | 1,000,000 | 0     | 1,000,000 |

**Risk:** Low. `this` inside a regular function is identical to `self`.

---

## 3. `memo()` debug timing locals always allocated — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/utils.ts:200–207`
**Category:** `micro`, `bundle-size`

`beforeCompareTime`, `afterCompareTime`, `startCalcTime`, `endCalcTime` are allocated even in prod. Move them inside the `if (process.env.NODE_ENV === 'development')` branch. Bundlers eliminate the dev branch entirely in prod.

**Risk:** None.

---

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
    if (children.length) recurse(children)
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

---

## 5. `isNumberArray()` uses `.every()` — Score: 1

**Status:** `[x]` done
**Implementation note:** Replaced `.every()` callback with an indexed `for` loop + early `return false`. Semantics preserved (empty array still returns `true`, matching the original `.every()` behavior). Drops one closure allocation per call.

**Location:** `src/utils.ts:79–81`
**Category:** `micro`

Replace with an indexed loop and early exit. Low frequency; only used during sort-fn auto-detection.

**Risk:** None.

---

## 6. `createColumnHelper()` allocates a fresh object on every call — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/helpers/columnHelper.ts:94–117`
**Category:** `micro`, `bundle-size`

The helper is stateless. Hoist a module-level singleton and return it.

**Before**

```ts
export function createColumnHelper<...>(): ColumnHelper<TFeatures, TData> {
  return {
    accessor: (accessor, column) => { ... },
    columns: (columns) => { ... },
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

---

## 7. `storeReactivityBindings()` allocates fresh bindings on every call — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/store-reactivity-bindings.ts:19–36`
**Category:** `micro`

Same pattern as #6. Hoist a singleton.

**Risk:** None.

---

## 8. `FlexRender` has redundant `'X' in props` checks — Score: 1

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/flex-render.ts:46–70`
**Category:** `micro`, `bundle-size`

TypeScript narrows the discriminated union via the truthy check alone.

**Before**

```ts
if ('cell' in props && props.cell) { ... }
if ('header' in props && props.header) { ... }
if ('footer' in props && props.footer) { ... }
```

**After**

```ts
if (props.cell) { ... }
if (props.header) { ... }
if (props.footer) { ... }
```

**Risk:** None.

---

# Core — cells

## 9. `cell_getContext()` re-allocates the context object on every call — Score: 6

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/core/cells/coreCellsFeature.utils.ts:51–65`
**Category:** `micro`, `memoization`

Every render that reads `cell.getContext()` (which every framework adapter does for every visible cell) builds a fresh 6-property object. Cells are long-lived; the context is functionally immutable. Cache it on the cell instance.

**Before**

```ts
export function cell_getContext(cell) {
  return {
    table: cell.table,
    column: cell.column,
    row: cell.row,
    cell,
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

# Core — columns

## 10. `replaceAll('.', '_')` in `constructColumn` — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/core/columns/constructColumn.ts:54–59`
**Category:** `micro`

`split('.').join('_')` outperforms `replaceAll` for single-char replacement in many engines. One-time cost per column.

**Risk:** None.

---

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

# Core — headers

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
// ... (rest unchanged: left/right loops, center filter, spread, buildHeaderGroups)
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
  const column = columns[i]
  if (!callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible)) continue
  if (column.columns.length) findMaxDepth(column.columns, depth + 1)
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
  const header = headers[i]
  if (!callMemoOrStaticFn(header.column, 'getIsVisible', column_getIsVisible)) continue
  ...
  const childSpans = recurseHeadersForSpans(header.subHeaders)
  for (let j = 0; j < childSpans.length; j++) {
    colSpan += childSpans[j].colSpan
    childRowSpans.push(childSpans[j].rowSpan)
  }
  let minChildRowSpan = childRowSpans[0]
  for (let j = 1; j < childRowSpans.length; j++) {
    if (childRowSpans[j] < minChildRowSpan) minChildRowSpan = childRowSpans[j]
  }
  ...
  results.push({ colSpan, rowSpan })
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

## 15. `header_getContext()` re-allocates per call — Score: 5

**Status:** `[ ]` not started
**Implementation note:** _(none)_

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

## 16. `table_getLeafHeaders` memoDeps call expensive functions to compute deps — Score: 7

**Status:** `[x]` done
**Implementation note:** Initially planned to replace the three cascading `callMemoOrStaticFn(...getLeft/Center/RightHeaderGroups)` calls in `memoDeps` with the six root atoms. On closer inspection the entire pinning branch in the function body was also redundant: `table.getHeaderGroups()` already builds the top row in left → center → right order via `buildHeaderGroups(allColumns, [...leftColumns, ...centerColumns, ...rightColumns], table)`, so the three side-specific getters give the same set of top-row headers as `getHeaderGroups()[0].headers`. Final form collapses to the same pattern as `table_getFooterGroups` / `table_getFlatHeaders`:

```ts
export function table_getLeafHeaders(table) {
  return (table.getHeaderGroups()[0]?.headers ?? [])
    .map((header) => header.getLeafHeaders())
    .flat()
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
memoDeps: () => [
  table.atoms.columnOrder?.get(),
  table.atoms.grouping?.get(),
  table.atoms.columnPinning?.get(),
  table.atoms.columnVisibility?.get(),
  table.options.columns,
  table.options.groupedColumnMode,
],
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

# Core — rows

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

## 18. `table_getRow` always calls `getCoreRowModel()` — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/core/rows/coreRowsFeature.utils.ts:228–251`
**Category:** `micro`

When the row exists in the primary row model (common case), skip the fallback fetch.

**Before**

```ts
let row = (searchAll ? table.getPrePaginatedRowModel() : table.getRowModel()).rowsById[rowId]
if (!row) {
  row = table.getCoreRowModel().rowsById[rowId]
  ...
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

# Core — row-models / table

## 19. `constructTable` `Object.assign` with `undefined` from optional feature method — Score: 1

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/core/table/constructTable.ts:46–50`
**Category:** `micro`

Guard against the `undefined` return from `feature.getDefaultTableOptions?.()`.

**Risk:** None.

---

## 20. `createCoreRowModel` deps `[table.options.data]` is fragile — Score: 4 (correctness leaning)

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/.../createCoreRowModel.ts:25`
**Category:** `memoization`

Today's dep is `table.options.data`. If a consumer recreates the options object (`options = { ...options, data: sameRef }`) the memo still works (same data reference). But if a consumer also recreates `data` per render without intent, the entire row model rebuilds. Consider exposing this as an atom (`table.atoms.data`) so adapters can route data identity through the reactivity layer instead of options identity.

**Risk:** Medium — surface change. Not strictly required, but a foundational correctness sharpening.

---

# Feature — column-faceting

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
const numericValues: number[] = []
for (let i = 0; i < flatRows.length; i++) {
  const v = Number(flatRows[i].getValue(columnId))
  if (!Number.isNaN(v)) numericValues.push(v)
}
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

## 22. `createFacetedUniqueValues` redundant `Map.has` before `Map.set` — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

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

---

## 23. Faceted min/max loop comparisons — Score: 1

**Status:** `[x]` done
**Implementation note:** `if/if` swapped for `if/else if` (skips the max comparison when min was a hit). Also loop start moved to `i = 1` since `numericValues[0]` is used to seed both `facetedMinValue` and `facetedMaxValue`. Done as part of the `for...of` → indexed `for` sweep.

**Location:** `src/features/column-faceting/createFacetedMinMaxValues.ts:59–65`
**Category:** `micro`

`if (...) ... else if (...)` instead of two unconditional ifs. Tiny.

**Risk:** None.

---

# Feature — column-filtering

## 24. `column_getFilterValue` / `column_getFilterIndex` linear `.find` — Score: 6

**Status:** `[-]` skipped
**Implementation note:** Per project guidance, `columnFilters` state typically holds 1–3 active filters. At that size, `.find` over the array is essentially O(1) in practice and outperforms a Record/Map lookup (no hashing, no per-rebuild allocation, JIT-friendly). The C × F scale-impact math assumes F grows with C, but in real tables F stays small even when C is large — so the multiplier shown in the table overstates the win. Both alternatives (per-column memo, `table.getColumnFiltersById()`) add overhead that isn't recouped at typical filter counts.

**Location:** `src/features/column-filtering/columnFilteringFeature.utils.ts:156–185`
**Category:** `big-o`, `memoization`

Each call walks the `columnFilters` array. When a filter UI re-renders columns, every column re-walks. Memoize at the column level with deps `[columnFilters, column.id]`, or expose `table.getColumnFiltersById()` (new API) returning a `Record<string, ColumnFilter>`.

**Before**

```ts
return column.table.atoms.columnFilters?.get()?.find((d) => d.id === column.id)
  ?.value
```

**After (new memoized table API)**

```ts
// in columnFilteringFeature.ts
table_getColumnFiltersById: {
  fn: () => Object.fromEntries((table.atoms.columnFilters?.get() ?? []).map(f => [f.id, f])),
  memoDeps: () => [table.atoms.columnFilters?.get()],
},
// in column_getFilterValue
return column.table.getColumnFiltersById()[column.id]?.value
```

**Big-O:** O(n) per call → O(1) lookup; O(n) one-time per `columnFilters` change.

**Scale impact** (`.find` comparisons saved per render — dimension: columns × active filters × renders, with average `.find` walking F/2):

| Cols (C) | Active filters (F) | Renders (R) | Before (≈ C × F/2 × R) | After (build map once: F × R) | Saved      |
| -------- | ------------------ | ----------- | ---------------------- | ----------------------------- | ---------- |
| 10       | 2                  | 10          | 100                    | 20                            | 80         |
| 50       | 5                  | 100         | 12,500                 | 500                           | 12,000     |
| 100      | 10                 | 1,000       | 500,000                | 10,000                        | 490,000    |
| 500      | 20                 | 10,000      | 50,000,000             | 200,000                       | 49,800,000 |

**Risk:** New API name — bikeshed. Backwards compatible.

---

## 25. `column_setFilterValue` re-searches array — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/column-filtering/columnFilteringFeature.utils.ts:198–232`
**Category:** `micro`

Calls `.find()` then `.map()` over the same array. Use `findIndex` and slice in/around it.

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

## 27. `globallyFilterableColumns` computed even when `globalFilter` is empty — Score: 6

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/column-filtering/createFilteredRowModel.ts:95–110`
**Category:** `micro`, `big-o` (short-circuit)

The `.getAllLeafColumns().filter(column_getCanGlobalFilter)` pass runs on _every_ filtered-row-model build, even when no global filter is active. Gate the entire branch.

**Before**

```ts
const globallyFilterableColumns = table
  .getAllLeafColumns()
  .filter((column) => column_getCanGlobalFilter(column))

if (globalFilter && globalFilterFn && globallyFilterableColumns.length) {
  filterableIds.push('__global__')
  ...
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

---

## 28. Row filter state reset allocates even when already reset — Score: 1

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/column-filtering/createFilteredRowModel.ts:59–66`
**Category:** `micro`

Skip the `row.columnFilters = {}` write when it's already an empty object.

**Risk:** None.

---

## 29. `filterRowModelFromLeafs` duplicates predicate work — Score: 3

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

---

# Feature — column-grouping

## 30. `existingGrouping.includes(colId)` per cell value access — Score: 7

**Status:** `[-]` skipped
**Implementation note:** Per project guidance, `grouping` state typically holds 1–3 columns. At that size, `.includes()` on the array is ~2–3 reference comparisons — cheaper than a Set lookup (hash + bucket walk + comparison), and avoids the per-row-model-rebuild Set allocation. The G × C × R scale table assumes G grows; in real grouped tables G is bounded and small, so the constant-factor Set overhead would dominate the saved comparisons. See [[skip-policy-small-state-arrays]] for the project-wide rule.

**Location:** `src/features/column-grouping/createGroupedRowModel.ts:141–152`
**Category:** `big-o`

The grouped row's `getValue(colId)` calls `.includes()` on `existingGrouping` once (or twice — finding #31) per access. With G grouped columns and C total columns called over R grouped rows that's O(G × C × R). Cache as a Set built once at row-model build time.

**Before**

```ts
getValue: (colId: string) => {
  if (existingGrouping.includes(colId)) { ... }
  ...
}
```

**After**

```ts
// at top of _createGroupedRowModel:
const existingGroupingSet = new Set(existingGrouping)
// in closure:
getValue: (colId: string) => {
  if (existingGroupingSet.has(colId)) { ... }
  ...
}
```

**Big-O:** O(G) → O(1) per cell access.

**Scale impact** (`.includes` compares saved per render of grouped rows — dimension: grouped rows × cell reads × grouping length):

| Grouped rows (R) | Cell reads per row (C) | Grouping cols (G) | Before (R × C × G) | After (R × C × 1) | Saved     |
| ---------------- | ---------------------- | ----------------- | ------------------ | ----------------- | --------- |
| 10               | 10                     | 2                 | 200                | 100               | 100       |
| 100              | 20                     | 3                 | 6,000              | 2,000             | 4,000     |
| 1,000            | 50                     | 5                 | 250,000            | 50,000            | 200,000   |
| 10,000           | 100                    | 10                | 10,000,000         | 1,000,000         | 9,000,000 |

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

## 32. `groupBy` uses `Array.prototype.reduce` — Score: 1

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/column-grouping/createGroupedRowModel.ts:204–220`
**Category:** `micro`

Trivial `for` loop replacement of `.reduce`.

**Risk:** None.

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

# Feature — column-ordering

## 34. `orderColumns` uses `grouping.includes` — Score: 7

**Status:** `[-]` skipped
**Implementation note:** Per project guidance, `grouping` state typically holds 1–3 columns. The L × G scale-table line that shows `L × G` ballooning with L assumes G also grows, but G stays bounded in real tables — so the inner walk is essentially L × constant ≈ O(L), comparable to L + G once the per-call Set allocation and hashing overhead are factored in. Matches the same decision recorded in #39 for the pin-side partition. See [[skip-policy-small-state-arrays]].

**Location:** `src/features/column-ordering/columnOrderingFeature.utils.ts:205–225`
**Category:** `big-o`

The `.filter((col) => !grouping.includes(col.id))` runs `.includes` per leaf column. Build a Set once.

**Before**

```ts
const nonGroupingColumns = leafColumns.filter(
  (col) => !grouping.includes(col.id),
)
```

**After**

```ts
const groupingSet = new Set(grouping)
const nonGroupingColumns = leafColumns.filter((col) => !groupingSet.has(col.id))
```

**Big-O:** O(L × G) → O(L + G). Triggered on every column-order / grouping change.

**Scale impact** (`.includes` compares per call — dimension: leaf columns × grouping cols):

| Leaf cols (L) | Grouping cols (G) | Before (L × G) | After (L + G) | Saved  |
| ------------- | ----------------- | -------------- | ------------- | ------ |
| 10            | 1                 | 10             | 11            | -1     |
| 100           | 3                 | 300            | 103           | 197    |
| 1,000         | 5                 | 5,000          | 1,005         | 3,995  |
| 10,000        | 10                | 100,000        | 10,010        | 89,990 |

**Risk:** None.

---

# Feature — column-pinning

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
const cellsByColumnId = new Map<string, (typeof allVisibleCells)[number]>()
for (let i = 0; i < allVisibleCells.length; i++) {
  cellsByColumnId.set(allVisibleCells[i].column.id, allVisibleCells[i])
}
for (let i = 0; i < left.length; i++) {
  const cell = cellsByColumnId.get(left[i])
  if (cell) {
    cell.position = 'left'
    cells.push(cell)
  }
}
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

## 36. `[...left, ...right].includes(id)` for center column filtering — Score: 6

**Status:** `[-]` skipped
**Implementation note:** Per project guidance, `columnPinning` state (`left` + `right`) typically holds 1–3 ids per side. At that size, `.includes()` on the small arrays outperforms a Set (no hashing, no per-call allocation). Same reasoning as #39, which deliberately chose `.includes()` over Sets for the cell-side partition. Note: the per-call `[...left, ...right]` spread itself is wasted work and could be removed without converting to a Set — `(left.includes(id) || right.includes(id))` is the equivalent allocation-free check. Documenting that micro-fix here for any later pass that wants to pick it up; not pursuing it now since it doesn't change asymptotic behavior. See [[skip-policy-small-state-arrays]].

**Location:** `src/features/column-pinning/columnPinningFeature.utils.ts:189, 430`
**Category:** `big-o`

Builds an array, then `.includes()` on it for every cell/column. Use a Set.

**Before**

```ts
const leftAndRight: Array<string> = [...left, ...right]
return allCells.filter((d) => !leftAndRight.includes(d.column.id))
```

**After**

```ts
const leftAndRight = new Set<string>()
for (let i = 0; i < left.length; i++) leftAndRight.add(left[i])
for (let i = 0; i < right.length; i++) leftAndRight.add(right[i])
return allCells.filter((d) => !leftAndRight.has(d.column.id))
```

**Big-O:** O(C × (P_l + P_r)) → O(C + P_l + P_r) per row, per call.

**Scale impact** (`.includes` compares per render — dimension: rows × cells × pinned total):

| Rows (R) | Cells/row (C) | Pinned (P) | Before (R × C × P) | After (R × (C + P)) | Saved     |
| -------- | ------------- | ---------- | ------------------ | ------------------- | --------- |
| 10       | 10            | 2          | 200                | 120                 | 80        |
| 100      | 20            | 4          | 8,000              | 2,400               | 5,600     |
| 1,000    | 50            | 6          | 300,000            | 56,000              | 244,000   |
| 10,000   | 100           | 10         | 10,000,000         | 1,100,000           | 8,900,000 |

**Risk:** None.

---

# Feature — column-resizing

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
  try { window.addEventListener('test', noop, options); ... }
  ...
  passiveSupported = supported
  return passiveSupported
}
```

**Big-O:** Avoid a DOM listener add+remove on every resize-handler hook-up.

**Risk:** None. Behavior is what the original obviously intended.

---

# Feature — column-sizing

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
    table.atoms.columnPinning?.get(),
    table.atoms.columnVisibility?.get(),
    table.options.columns,
  ],
},
// (same memoDeps for the L/C/R variants)
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

# Feature — column-visibility

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
// .includes() on the small left/right arrays is cheaper than building Sets
// for the typical 1–2 pinned columns per side.
const centerCells: Array<Cell<...>> = []
for (const cell of cells) {
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

---

# Feature — global-filtering

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

# Feature — row-expanding

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

## 43. `table_getCanSomeRowsExpand` lacks memoization — Score: 4

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

---

# Feature — row-pagination

## 44. `table_getPageOptions` `Array.from(new Array(pageCount)).fill(null).map((_, i) => i)` — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/row-pagination/rowPaginationFeature.utils.ts:215–225`
**Category:** `micro`, `bundle-size`

**Before**

```ts
let pageOptions: Array<number> = []
if (pageCount && pageCount > 0) {
  pageOptions = [...new Array(pageCount)].fill(null).map((_, i) => i)
}
```

**After**

```ts
if (pageCount <= 0) return []
return Array.from({ length: pageCount }, (_, i) => i)
```

**Risk:** None.

---

# Feature — row-pinning

## 45. `row_getPinnedIndex` allocates intermediate id array — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/row-pinning/rowPinningFeature.utils.ts:247–261`
**Category:** `micro`

`.map(({ id }) => id).indexOf(row.id)` → `findIndex(r => r.id === row.id)`.

**Risk:** None.

---

# Feature — row-selection

## 46. `table_toggleAllRowsSelected` clones entire selection on deselect — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

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

## 47. `table_getIsAllRowsSelected` / `getIsAllPageRowsSelected` flow cleanup — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/row-selection/rowSelectionFeature.utils.ts:247–300`
**Category:** `micro`

Replace `let isAll = …; if (cond) isAll = false; return isAll` with `return !preGroupedFlatRows.some(...)`. Engine inlining better.

**Risk:** None.

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

# Feature — row-sorting

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
const indexed = rows.map((row, index) => ({ row, index }))
indexed.sort((a, b) => {
  // existing comparator on a.row vs b.row, falling back to a.index - b.index
})
return indexed.map((x) => x.row)
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

## 51. `column_getIsSorted` / `column_getSortIndex` `.find` per call — Score: 4

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/row-sorting/rowSortingFeature.utils.ts:388–418`
**Category:** `memoization`

Both walk the `sorting` array; called for every visible sortable column on every render. Memoize per column with deps `[sorting, column.id]`, or add `table.getSortingById()`.

**Scale impact** (`.find`/`.findIndex` compares per render — dimension: visible sortable cols × active sorts × renders):

| Cols (C) | Active sorts (S) | Renders (R) | Before (≈ C × S/2 × R, × 2 fns) | After (memoized: ~0) | Saved      |
| -------- | ---------------- | ----------- | ------------------------------- | -------------------- | ---------- |
| 10       | 1                | 10          | 100                             | 0                    | 100        |
| 50       | 3                | 100         | 15,000                          | 0                    | 15,000     |
| 100      | 5                | 1,000       | 500,000                         | 0                    | 500,000    |
| 500      | 10               | 10,000      | 50,000,000                      | 0                    | 50,000,000 |

**Risk:** None.

---

# Stock function — `sortFns.ts`

## 52. `compareAlphanumeric` allocates 2 arrays per comparison — Score: 6

**Status:** `[x]` done
**Implementation note:** Went further than proposed — the audit undercounted the allocations. Besides the two `.filter(Boolean)` arrays per comparison, every chunk-pair iteration allocated and **default-sorted** a fresh `[an, bn]` array (`const combo = [an, bn].sort()`), paying array allocation + sort dispatch + number→string coercion just to classify NaN-ness. Since chunks from `reSplitAlphaNumeric` are either all-digit (`parseInt` always succeeds) or digit-free (`parseInt` always `NaN`), two plain `isNaN` checks replace the combo entirely (`aIsNaN && bIsNaN` → both-string branch, `aIsNaN || bIsNaN` → mixed branch). The `.filter(Boolean)` drop required two semantic guards: (1) empty chunks (which only occur at split-array boundaries) are skipped inline at the top of the loop; (2) the prefix tail return counts only **non-empty** remaining chunks instead of raw `aLen - ai - (bLen - bi)`. Net per comparison: 3+k array allocations → 1 per side (the unavoidable `.split()`), where k = chunk pairs visited. Measured on a 10k-row sort of mixed `itemNNNN-revNN` strings (Node, median of 7 runs): **36.5ms → 20.7ms (~43% faster)**. Equivalence verified two ways: a vocab×vocab differential test against the verbatim old implementation (625 pairs covering boundary digits, leading zeros, pure digits, empties, 30-digit overflow) plus targeted boundary-chunk unit tests, all in `tests/unit/fns/sortFns.test.ts`. Unblocked by #61 — the auto path can now actually select `alphanumeric` again.

**Location:** `src/fns/sortFns.ts:154–200`
**Category:** `big-o`, `micro`

`aStr.split(re).filter(Boolean)` runs O(n log n) times during a sort (once per comparison). Each call allocates two arrays. Drop the `.filter(Boolean)` by skipping empty pieces inline.

**Before**

```ts
const a = aStr.split(reSplitAlphaNumeric).filter(Boolean)
const b = bStr.split(reSplitAlphaNumeric).filter(Boolean)
```

**After** (sketch)

```ts
const a = aStr.split(reSplitAlphaNumeric)
const b = bStr.split(reSplitAlphaNumeric)
let ai = 0, bi = 0
while (ai < a.length || bi < b.length) {
  while (ai < a.length && !a[ai]) ai++
  while (bi < b.length && !b[bi]) bi++
  ...
}
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

## 53. `sortFn_datetime` compares mixed Date / string / number — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/fns/sortFns.ts:99–114`
**Category:** `micro`

Normalize `Date` → `getTime()` once at the top, then compare numbers (or fall through to `>/<` for strings). Marginal but the comparator runs O(n log n) times.

**Risk:** None when only used for true datetime columns. Verify mixed-type columns don't rely on coercion.

---

# Stock function — `filterFns.ts`

## 54. `filterFn_between` / `filterFn_betweenInclusive` allocate `['', undefined]` per row — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

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

---

## 55. `filterFn_arrHas` and `filterFn_arrIncludesAll` use `.some()` — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

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

---

## 56. `filterFn_greaterThanOrEqualTo` / `lessThanOrEqualTo` delegate via 2–3 function calls — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/fns/filterFns.ts:149–195`
**Category:** `micro`, `bundle-size` (tradeoff)

Currently `>=` runs `>` then `=`. Could inline the comparison directly, at the cost of more code. Worth it only if profiling shows these in hot loops.

**Risk:** Bundle size grows slightly.

---

# Stock function — `aggregationFns.ts`

## 57. `aggregationFn_median` full sorts for the median — Score: 3

**Status:** `[~]` partial
**Implementation note:** The quickselect-vs-sort question (the headline of this finding) was **not** addressed — `.sort()` is still used because quickselect adds ~50 LOC of complexity that isn't justified without profiling evidence that median is hot for very large groups. The smaller win **was** captured though: fused `.map((row) => row.getValue(columnId))` with the previous `isNumberArray(values)` validation pass into a single loop that extracts values into a preallocated array and bails immediately on the first non-number. Removes one full walk over the values array per call. The full-sort cost remains.

**Location:** `src/fns/aggregationFns.ts:156–166`
**Category:** `big-o`

Median requires only the middle element; quickselect is O(n) average vs `.sort()` O(n log n). Worth it only for large groups; skip otherwise to keep bundle slim.

**Risk:** Quickselect adds bytes and complexity. Recommend leaving as-is unless real-world data shows hot.

---

## 58. `aggregationFn_unique` + `aggregationFn_uniqueCount` rebuild Set twice — Score: 2

**Status:** `[~]` partial
**Implementation note:** The cross-function memoization the original finding proposed (sharing a Set between `aggregationFn_unique` and `aggregationFn_uniqueCount` when both run on the same column in the same pass) was **not** implemented — the use case is rare enough that it's not worth the API plumbing. The per-call fusion **was** captured though: both functions now iterate `leafRows` directly into a Set instead of building an intermediate Array via `.map` and then constructing the Set from it. Saves one Array allocation of size `leafRows.length` per call.

**Location:** `src/fns/aggregationFns.ts:172–193`
**Category:** `memoization`

Only useful if both are called on the same column in the same aggregation pass. Not a common pattern; skip unless a consumer hits it.

**Risk:** None.

---

# Cross-feature observations

## 59. `table.getAllLeafColumns()` is called many places per row-model build — Score: 4

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** filterFns, faceting, grouping, pinning, global filtering
**Category:** `memoization`

`getAllLeafColumns()` is memoized at the table level, but its deps are sometimes computed inline (see #16 type defects). Verify the memo holds across the row-model rebuild lifecycle. If it doesn't, this is the most-leveraged optimization in the package.

**Risk:** Already memoized in `coreColumnsFeature`; just audit for accidental dep churn.

---

## 60. Prototype-builder boilerplate repeats 4× — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `constructCell.ts`, `constructColumn.ts`, `constructHeader.ts`, `constructRow.ts`
**Category:** `bundle-size`

Each file has a `getXyzPrototype(table)` function with identical shape — `if (!table._xyzPrototype) { table._xyzPrototype = { table }; for (...) feature.assignXyzPrototype?.(...) }`. Could collapse to a shared utility keyed by `prototypeKey`/`assignMethodName`. Saves ~300–500 bytes gzipped at the cost of indirection at construction time only.

**Risk:** Slight loss of readability. Worth doing only if running close to a size-limit budget.

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
    if (sortFns?.datetime) return sortFns.datetime
  }
  if (typeof value === 'string') {
    isString = true
    if (value.split(reSplitAlphaNumeric).length > 1) {
      if (sortFns?.alphanumeric) return sortFns.alphanumeric
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

# Suggested priority order

Anything **≥ 7**:

| #   | Title                                                       | Score | Category      |
| --- | ----------------------------------------------------------- | ----- | ------------- |
| 12  | `centerColumns` filter uses `.includes` — Set               | 8     | big-o         |
| 35  | `row_getLeftVisibleCells` uses `.find` over visible cells   | 8     | big-o         |
| 37  | `passiveEventSupported` cache bug                           | 8     | bug           |
| 38  | `table_getTotalSize` & L/C/R variants unmemoized            | 8     | memoization   |
| 42  | `row_getIsAllParentsExpanded` checks wrong row              | 8     | bug           |
| 1   | `memo()` deps `.some` → loop                                | 7     | micro         |
| 14  | `recurseHeadersForSpans` spread + filter chain              | 7     | big-o / micro |
| 16  | `table_getLeafHeaders` memoDeps call expensive fns          | 7     | memoization   |
| 30  | grouped row's `existingGrouping.includes` per cell          | 7     | big-o         |
| 34  | `orderColumns` `grouping.includes` → Set                    | 7     | big-o         |
| 49  | `createSortedRowModel` clones every row                     | 7     | big-o / micro |
| 50  | `column_getAutoSortFn` `slice(10)` should be `slice(0, 10)` | 7     | bug           |
| 61  | `column_getAutoSortFn` text fallback clobbers auto-match    | 8     | bug           |

Anything **5–6**: a second wave of memoization gaps and partition-loop consolidations (#2, #9, #15, #21, #24, #27, #33, #36, #39, #40, #41, #52). All low-risk.

Anything **≤ 4**: incremental polish; pursue if budget allows or when adjacent code is being touched.

---

## Out-of-scope reminders

- No changes to public API arg/return types.
- No changes to the shape of `table.getState()`.
- New `get*` methods are allowed when they unlock big-O wins (e.g., `table.getColumnFiltersById()`, `table.getSortingById()`) — bundle every such addition against the size-limit budget.
- Bundle-size wins ≤ 200 bytes gzipped per change should be ignored unless they ride along with another refactor.

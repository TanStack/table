# `@tanstack/table-core` — Performance Refactor Catalog: Todo

Generated from `perf.md`. The original `perf.md` is intentionally preserved.

Entries are sorted by adjusted effectiveness score descending.

## Counts

- **Entries:** 32
- **Source findings:** 32
- **Cross-cutting sweeps:** 0

## Score 6

## 9. `cell_getContext()` re-allocates the context object on every call — Score: 6

**Status:** `[ ]` not started
**Implementation note:** _(none)_

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

# Core — columns

## 27. `globallyFilterableColumns` computed even when `globalFilter` is empty — Score: 6

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

---

## Score 5

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

## 59. `table.getAllLeafColumns()` is called many places per row-model build — Score: 4

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** filterFns, faceting, grouping, pinning, global filtering
**Category:** `memoization`

`getAllLeafColumns()` is memoized at the table level, but its deps are sometimes computed inline (see #16 type defects). Verify the memo holds across the row-model rebuild lifecycle. If it doesn't, this is the most-leveraged optimization in the package.

**Risk:** Already memoized in `coreColumnsFeature`; just audit for accidental dep churn.

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

---

## 18. `table_getRow` always calls `getCoreRowModel()` — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

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

# Core — row-models / table

## 25. `column_setFilterValue` re-searches array — Score: 3

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/column-filtering/columnFilteringFeature.utils.ts:198–232`
**Category:** `micro`

Calls `.find()` then `.map()` over the same array. Use `findIndex` and slice in/around it.

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

## Score 2

## 3. `memo()` debug timing locals always allocated — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/utils.ts:200–207`
**Category:** `micro`, `bundle-size`

`beforeCompareTime`, `afterCompareTime`, `startCalcTime`, `endCalcTime` are allocated even in prod. Move them inside the `if (process.env.NODE_ENV === 'development')` branch. Bundlers eliminate the dev branch entirely in prod.

**Risk:** None.

---

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

## 60. Prototype-builder boilerplate repeats 4× — Score: 2

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `constructCell.ts`, `constructColumn.ts`, `constructHeader.ts`, `constructRow.ts`
**Category:** `bundle-size`

Each file has a `getXyzPrototype(table)` function with identical shape — `if (!table._xyzPrototype) { table._xyzPrototype = { table }; for (...) feature.assignXyzPrototype?.(...) }`. Could collapse to a shared utility keyed by `prototypeKey`/`assignMethodName`. Saves ~300–500 bytes gzipped at the cost of indirection at construction time only.

**Risk:** Slight loss of readability. Worth doing only if running close to a size-limit budget.

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

---

# Core — cells

## 19. `constructTable` `Object.assign` with `undefined` from optional feature method — Score: 1

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/core/table/constructTable.ts:46–50`
**Category:** `micro`

Guard against the `undefined` return from `feature.getDefaultTableOptions?.()`.

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

## 32. `groupBy` uses `Array.prototype.reduce` — Score: 1

**Status:** `[ ]` not started
**Implementation note:** _(none)_

**Location:** `src/features/column-grouping/createGroupedRowModel.ts:204–220`
**Category:** `micro`

Trivial `for` loop replacement of `.reduce`.

**Risk:** None.

---

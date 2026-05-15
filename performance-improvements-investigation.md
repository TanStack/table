# Performance Improvements Investigation — `packages/table-core`

Scope: micro-perf opportunities in `packages/table-core/src`. Out of scope: `memoDeps` changes, state shape changes, type API changes.

For each item:

- **Problem** — what the code does today and why it's wasteful (complexity / hot-path notes).
- **Current** — code snippet from the file.
- **Proposed** — code or pseudo-code for the fix.

Hot-path glossary used below:

- _per-comparator_ — runs O(n log n) times during a sort.
- _per-row_ — runs once per row during the relevant row-model build.
- _per-cell-read_ — runs every time `row.getValue(colId)` is invoked.

---

## Tier 1 — High impact (hot paths, clear wins)

### - [x] 1. `buildHeaderGroups.ts:73` — array copy + reverse just to read last item

**Problem:** Inside the `headersToGroup.forEach` loop, `[...pendingParentHeaders].reverse()[0]` allocates a full copy of the array, reverses it in place, then reads index 0. Runs once per header processed during header-group build. O(n) work for an O(1) read.

**Current:**

```ts
// packages/table-core/src/core/headers/buildHeaderGroups.ts:73
const latestPendingParentHeader = [...pendingParentHeaders].reverse()[0]
```

**Proposed:**

```ts
const latestPendingParentHeader =
  pendingParentHeaders[pendingParentHeaders.length - 1]
```

---

### - [x] 2. `columnVisibilityFeature.utils.ts:261-267` — spread-in-reduce is O(n²)

**Problem:** `table_toggleAllColumnsVisible` builds a record by spreading `obj` on every iteration, copying all previously-added keys. Total work is O(n²) in the number of columns.

**Current:**

```ts
// packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts:261-267
table.getAllLeafColumns().reduce(
  (obj, column) => ({
    ...obj,
    [column.id]: !value ? !column_getCanHide(column) : value,
  }),
  {},
)
```

**Proposed:**

```ts
const cols = table.getAllLeafColumns()
const obj: Record<string, boolean> = {}
for (const column of cols) {
  obj[column.id] = !value ? !column_getCanHide(column) : value
}
return obj
// or: Object.fromEntries(cols.map(c => [c.id, !value ? !column_getCanHide(c) : value]))
```

---

### - [x] 3. `constructColumn.ts:67-78` — `accessorKey.split('.')` runs per cell read

**Problem:** For nested-key columns, the closure captured by `accessorFn` calls `accessorKey.split('.')` on every invocation. `accessorFn` is the per-cell-read hot path, so the split happens on every `row.getValue(colId)`. Hoist the split once at column construction time.

**Current:**

```ts
// packages/table-core/src/core/columns/constructColumn.ts:67-78
if (accessorKey.includes('.')) {
  accessorFn = (originalRow: TData) => {
    let result = originalRow as Record<string, any> | undefined

    for (const key of accessorKey.split('.')) {
      result = result?.[key]
      if (process.env.NODE_ENV === 'development' && result === undefined) {
        console.warn(
          `"${key}" in deeply nested key "${accessorKey}" returned undefined.`,
        )
      }
    }

    return result as TValue
  }
}
```

**Proposed:**

```ts
if (accessorKey.includes('.')) {
  const keys = accessorKey.split('.')
  accessorFn = (originalRow: TData) => {
    let result = originalRow as Record<string, any> | undefined
    for (const key of keys) {
      result = result?.[key]
      if (process.env.NODE_ENV === 'development' && result === undefined) {
        console.warn(
          `"${key}" in deeply nested key "${accessorKey}" returned undefined.`,
        )
      }
    }
    return result as TValue
  }
}
```

---

### - [x] 4. Pinned-id `.map(...).find(...).filter(Boolean)` pattern — O(n×m) per call

**Problem:** For each id in a pinned list (`left`, `right`, `top`, `bottom`), the code linear-scans the cells/columns array via `.find`. Total work is O(pinned × allCells). The two `row_get*VisibleCells` versions are _per-row_ hot paths.

**Locations:**

- `packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts:215, 246, 350, 380, 651-654, 676-679`
- `packages/table-core/src/core/headers/coreHeadersFeature.utils.ts:91-97`
- `packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts:256` (`leafColumns.find` inside a `.filter` callback for each filter)

**Current (representative):**

```ts
// packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts:213-216
const cells = left
  .map((columnId) => allCells.find((cell) => cell.column.id === columnId)!)
  .filter(Boolean)
```

**Proposed (build a Map once, then look up):**

```ts
const cellsById = new Map<string, (typeof allCells)[number]>()
for (const cell of allCells) cellsById.set(cell.column.id, cell)

const cells: typeof allCells = []
for (const columnId of left) {
  const cell = cellsById.get(columnId)
  if (cell) cells.push(cell)
}
```

---

### - [ ] 5. `filterFns.ts:210, 215, 231, 236` — array literal allocated per filter call

**Problem:** `between` / `betweenInclusive` filters are evaluated _per-row_. Each evaluation allocates a fresh 2-element array (`['', undefined]`) just to call `.includes`. Replace with two equality checks.

**Current:**

```ts
// packages/table-core/src/fns/filterFns.ts:210-211
((['', undefined] as Array<any>).includes(filterValues[0]) ||
  filterFn_greaterThan(row as any, columnId, filterValues[0])) && ...
```

**Proposed:**

```ts
((filterValues[0] === '' || filterValues[0] === undefined) ||
  filterFn_greaterThan(row as any, columnId, filterValues[0])) && ...
```

Apply the same change at lines 215, 231, 236.

---

### - [x] 6. `columnOrderingFeature.utils.ts:162-168` — quadratic ordering loop

**Problem:** Each iteration uses `.shift()` (O(n)), `.findIndex()` (O(n)), and `.splice()` (O(n)). Total worst case is O(n²) or worse, called any time the column model is rebuilt with a non-empty `columnOrder`.

**Current:**

```ts
// packages/table-core/src/features/column-ordering/columnOrderingFeature.utils.ts:154-172
const columnOrderCopy = [...columnOrder]
const columnsCopy = [...columns]

while (columnsCopy.length && columnOrderCopy.length) {
  const targetColumnId = columnOrderCopy.shift()
  const foundIndex = columnsCopy.findIndex((d) => d.id === targetColumnId)
  if (foundIndex > -1) {
    orderedColumns.push(columnsCopy.splice(foundIndex, 1)[0]!)
  }
}

orderedColumns = [...orderedColumns, ...columnsCopy]
```

**Proposed (linear with Map + Set):**

```ts
const remaining = new Map<string, (typeof columns)[number]>()
for (const c of columns) remaining.set(c.id, c)

for (const id of columnOrder) {
  const col = remaining.get(id)
  if (col) {
    orderedColumns.push(col)
    remaining.delete(id)
  }
}
// Append the leftovers in original order
for (const c of columns) {
  if (remaining.has(c.id)) orderedColumns.push(c)
}
```

---

### - [x] 7. `sortFns.ts:162-163` — `.shift()` in `compareAlphanumeric`

**Problem:** `.shift()` is O(n) (re-indexes the remaining elements). For a string with `k` chunks this is O(k²) per comparator call, and the comparator runs O(n log n) times during a sort.

**Current:**

```ts
// packages/table-core/src/fns/sortFns.ts:161-163
while (a.length && b.length) {
  const aa = a.shift()!
  const bb = b.shift()!
  ...
}
```

**Proposed:**

```ts
let ai = 0, bi = 0
while (ai < a.length && bi < b.length) {
  const aa = a[ai++]!
  const bb = b[bi++]!
  ...
}
return (a.length - ai) - (b.length - bi)
```

---

### - [x] 8. `createSortedRowModel.ts:91-119` — repeated id-keyed lookup in inner comparator

**Problem:** The comparator runs O(n log n) times. Each iteration does a `columnInfoById[sortEntry.id]` hash lookup. Pre-resolving once per sort call avoids the lookup inside the inner loop. For very tight comparators, an indexed `for` loop is also slightly faster than `for…of` (no iterator object).

**Current:**

```ts
// packages/table-core/src/features/row-sorting/createSortedRowModel.ts:91-119
sortedData.sort((rowA, rowB) => {
  for (const sortEntry of availableSorting) {
    const columnInfo = columnInfoById[sortEntry.id]!
    const sortUndefined = columnInfo.sortUndefined
    const isDesc = sortEntry.desc
    ...
  }
  return rowA.index - rowB.index
})
```

**Proposed:**

```ts
// Resolve once per sort call, outside the comparator.
const resolved = availableSorting.map((sortEntry) => {
  const info = columnInfoById[sortEntry.id]!
  return {
    id: sortEntry.id,
    desc: sortEntry.desc,
    sortUndefined: info.sortUndefined,
    invertSorting: info.invertSorting,
    sortFn: info.sortFn,
  }
})
const len = resolved.length

sortedData.sort((rowA, rowB) => {
  for (let i = 0; i < len; i++) {
    const r = resolved[i]!
    const isDesc = r.desc
    ...
  }
  return rowA.index - rowB.index
})
```

---

### - [x] 9. `columnSizingFeature.utils.ts:198-213` — `header_getStart` is O(n²) per header row

**Problem:** Each call recurses into the previous sibling, which recurses again. Computing `getStart` for every header in a row is therefore O(n²) in the number of headers.

**Current:**

```ts
// packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts:198-213
export function header_getStart(header) {
  if (header.index > 0) {
    const prevSiblingHeader = header.headerGroup?.headers[header.index - 1]
    if (prevSiblingHeader) {
      return (
        header_getStart(prevSiblingHeader) + header_getSize(prevSiblingHeader)
      )
    }
  }
  return 0
}
```

**Proposed:** linearize per row by accumulating, e.g. by computing a starts cache for the whole `headerGroup.headers` array on first request, or by walking forward iteratively rather than recursing backward:

```ts
export function header_getStart(header) {
  const headers = header.headerGroup?.headers
  if (!headers || header.index === 0) return 0
  let start = 0
  for (let i = 0; i < header.index; i++) {
    start += header_getSize(headers[i]!)
  }
  return start
}
```

Best: cache the prefix-sum array per `headerGroup` so all sibling lookups are O(1).

---

### - [ ] 10. `buildHeaderGroups.ts:36, 40-48` — discarded `.map` result and intermediate filtered array

**Problem:**

- Line 36: `h.subHeaders.map(recurseHeader)` builds an array that is never used.
- Lines 40-48: `columns.filter(...).forEach(...)` allocates an intermediate filtered array; can be one pass. Also the trailing `, 0` argument to `.forEach` (line 48) is meaningless — `forEach`'s second arg is `thisArg`.

**Current:**

```ts
// packages/table-core/src/core/headers/coreHeadersFeature.utils.ts:34-39 (note: file path)
const recurseHeader = (h) => {
  if (h.subHeaders.length) {
    h.subHeaders.map(recurseHeader)
  }
  leafHeaders.push(h)
}
```

```ts
// packages/table-core/src/core/headers/buildHeaderGroups.ts:40-48
columns
  .filter((column) =>
    callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible),
  )
  .forEach((column) => {
    if (column.columns.length) {
      findMaxDepth(column.columns, depth + 1)
    }
  }, 0)
```

**Proposed:**

```ts
const recurseHeader = (h) => {
  const subs = h.subHeaders
  for (let i = 0; i < subs.length; i++) recurseHeader(subs[i])
  leafHeaders.push(h)
}
```

```ts
for (const column of columns) {
  if (!callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible)) continue
  if (column.columns.length) findMaxDepth(column.columns, depth + 1)
}
```

---

## Tier 2 — Medium impact

### - [ ] 11. `columnPinningFeature.utils.ts` — `[...left, ...right]` then `.includes` instead of `Set`

**Problem:** `.includes` over an array is O(n). `rowPinningFeature.utils.ts:186-187` already uses `Set` for the same shape — this file is inconsistent.

**Current:**

```ts
// packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts:189-190
const leftAndRight: Array<string> = [...left, ...right]
return allCells.filter((d) => !leftAndRight.includes(d.column.id))
```

**Proposed:**

```ts
const pinned = new Set<string>()
for (const id of left) pinned.add(id)
for (const id of right) pinned.add(id)
return allCells.filter((d) => !pinned.has(d.column.id))
```

Apply at lines 410-413 and 697-698 too.

---

### - [ ] 12. `filterRowsUtils.ts:70-77` — `filterRow(row)` called twice

**Problem:** Same row, same predicate — called twice in adjacent branches.

**Current:**

```ts
// packages/table-core/src/features/column-filtering/filterRowsUtils.ts:70-82
if (filterRow(row) && !newRow.subRows.length) {
  ...
  continue
}

if (filterRow(row) || newRow.subRows.length) {
  ...
  continue
}
```

**Proposed:**

```ts
const pass = filterRow(row)
if (pass && !newRow.subRows.length) { ...; continue }
if (pass || newRow.subRows.length)  { ...; continue }
```

---

### - [ ] 13. `aggregationFns.ts:179` — triple iteration for unique

**Problem:** `.map → new Set → .values → Array.from` iterates the data three times and `.values()` is redundant (Set is already iterable).

**Current:**

```ts
// packages/table-core/src/fns/aggregationFns.ts:179
return Array.from(new Set(leafRows.map((d) => d.getValue(columnId))).values())
```

**Proposed (minimum):**

```ts
return Array.from(new Set(leafRows.map((d) => d.getValue(columnId))))
```

**Proposed (single pass):**

```ts
const set = new Set<unknown>()
for (const row of leafRows) set.add(row.getValue(columnId))
return Array.from(set)
```

---

### - [ ] 14. `aggregationFns.ts:156-159` — double iteration for median

**Problem:** Builds an array via `.map`, then `isNumberArray` calls `.every` to walk it again.

**Current:**

```ts
// packages/table-core/src/fns/aggregationFns.ts:156-159
const values = leafRows.map((row) => row.getValue(columnId))
if (!isNumberArray(values)) {
  return
}
```

**Proposed:**

```ts
const values: Array<number> = []
for (const row of leafRows) {
  const v = row.getValue(columnId)
  if (typeof v !== 'number') return
  values.push(v)
}
```

---

### - [ ] 15. `createFacetedMinMaxValues.ts:52-65` — quadruple iteration

**Problem:** `.map → .map(Number) → .filter` then a second `for…of` for min/max — the data is walked four times.

**Current:**

```ts
// packages/table-core/src/features/column-faceting/createFacetedMinMaxValues.ts:52-67
const numericValues = flatRows
  .map((flatRow) => flatRow.getValue(columnId))
  .map(Number)
  .filter((value) => !Number.isNaN(value))

if (!numericValues.length) return undefined

let facetedMinValue = numericValues[0]!
let facetedMaxValue = numericValues[0]!

for (const value of numericValues) {
  if (value < facetedMinValue) facetedMinValue = value
  if (value > facetedMaxValue) facetedMaxValue = value
}

return [facetedMinValue, facetedMaxValue]
```

**Proposed:**

```ts
let min = Infinity,
  max = -Infinity,
  seen = false
for (const row of flatRows) {
  const v = Number(row.getValue(columnId))
  if (Number.isNaN(v)) continue
  if (v < min) min = v
  if (v > max) max = v
  seen = true
}
return seen ? [min, max] : undefined
```

---

### - [ ] 16. `rowSelectionFeature.utils.ts:631-650` — `recurseRows` `.map(...).filter(x => !!x)`

**Problem:** Map produces undefined for non-selected rows, then filter discards them. Use `for…of` and conditionally push.

**Current:**

```ts
// packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts:630-651
return rows
  .map((row) => {
    const isSelected = isRowSelected(row)
    if (isSelected) {
      newSelectedFlatRows.push(row)
      newSelectedRowsById[row.id] = row
    }
    if (row.subRows.length) {
      row = { ...row, subRows: recurseRows(row.subRows, depth + 1) }
    }
    if (isSelected) return row
  })
  .filter((x) => !!x)
```

**Proposed:**

```ts
const out: Array<Row<TFeatures, TData>> = []
for (let row of rows) {
  const isSelected = isRowSelected(row)
  if (isSelected) {
    newSelectedFlatRows.push(row)
    newSelectedRowsById[row.id] = row
  }
  if (row.subRows.length) {
    row = { ...row, subRows: recurseRows(row.subRows, depth + 1) }
  }
  if (isSelected) out.push(row)
}
return out
```

---

### - [ ] 17. `rowSelectionFeature.utils.ts:343-344` — `.filter().some()`

**Problem:** Allocates an intermediate filtered array just to test a predicate.

**Current:**

```ts
// packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts:342-344
return table_getIsAllPageRowsSelected(table)
  ? false
  : paginationFlatRows
      .filter((row) => row_getCanSelect(row))
      .some((row) => row_getIsSelected(row) || row_getIsSomeSelected(row))
```

**Proposed:**

```ts
return table_getIsAllPageRowsSelected(table)
  ? false
  : paginationFlatRows.some(
      (row) =>
        row_getCanSelect(row) &&
        (row_getIsSelected(row) || row_getIsSomeSelected(row)),
    )
```

---

### - [ ] 18. `rowSelectionFeature.utils.ts:592` — clearing object via `Object.keys().forEach(delete)`

**Problem:** Allocates the keys array; same effect as iterating directly. Used to enforce single-select.

**Current:**

```ts
// packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts:592
Object.keys(selectedRowIds).forEach((key) => delete selectedRowIds[key])
```

**Proposed:**

```ts
for (const key in selectedRowIds) delete selectedRowIds[key]
```

(Caller relies on the object identity, so can't reassign to `{}` here.)

---

### - [ ] 19. `createGroupedRowModel.ts:107` — `Array.from(map.entries()).map(...)`

**Problem:** Materializes the Map's entries into an array, then maps it. Iterating the Map directly would skip the intermediate.

**Current:**

```ts
// packages/table-core/src/features/column-grouping/createGroupedRowModel.ts:107-108
const aggregatedGroupedRows = Array.from(rowGroupsMap.entries()).map(
  ([groupingValue, groupedRows], index) => {
    ...
  },
)
```

**Proposed:**

```ts
const aggregatedGroupedRows: Array<Row<TFeatures, TData>> = []
let index = 0
for (const [groupingValue, groupedRows] of rowGroupsMap) {
  ...
  aggregatedGroupedRows.push(row)
  index++
}
```

Same file, lines 115, 178, 192 are `forEach` callbacks — convert to `for…of` for the same reason.

---

### - [ ] 20. `.map(...).flat()` should be `.flatMap(...)`

**Problem:** `.map(...).flat()` allocates an intermediate array of arrays. `.flatMap(...)` does it in one pass.

**Locations:**

- `packages/table-core/src/core/headers/coreHeadersFeature.utils.ts:144-150, 187-191`
- `packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts:507-512, 533-538, 559-564`

**Current (representative):**

```ts
return headerGroups
  .map((headerGroup) => {
    return headerGroup.headers
  })
  .flat()
```

**Proposed:**

```ts
return headerGroups.flatMap((headerGroup) => headerGroup.headers)
```

---

### - [ ] 21. `coreRowsFeature.utils.ts:33-35, 67-72` — double cache lookup in `row_getValue`

**Problem:** Hot path (per-cell-read). `row._valuesCache[columnId]` is read after writing — one lookup more than needed.

**Current:**

```ts
// packages/table-core/src/core/rows/coreRowsFeature.utils.ts:33-35
row._valuesCache[columnId] = column.accessorFn(row.original, row.index)

return row._valuesCache[columnId]
```

**Proposed:**

```ts
const v = column.accessorFn(row.original, row.index)
row._valuesCache[columnId] = v
return v
```

Apply equivalently in `row_getUniqueValues` (lines 67-72).

---

### - [ ] 22. `rowSortingFeature.utils.ts:199-202` — `find` then `findIndex` for the same predicate

**Problem:** Two scans of `old` to compute related results. `findIndex` already gives both: the index, and `> -1` tells you whether it exists.

**Current:**

```ts
// packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts:201-202
const existingSorting = old.find((d) => d.id === column.id)
const existingIndex = old.findIndex((d) => d.id === column.id)
```

**Proposed:**

```ts
const existingIndex = old.findIndex((d) => d.id === column.id)
const existingSorting = existingIndex > -1 ? old[existingIndex] : undefined
```

---

## Tier 3 — Low impact / idiomatic cleanups

### - [ ] 23. `rowPaginationFeature.utils.ts:222` — three array allocations to make `[0..n-1]`

**Current:**

```ts
// packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts:222
pageOptions = [...new Array(pageCount)].fill(null).map((_, i) => i)
```

**Proposed:**

```ts
pageOptions = Array.from({ length: pageCount }, (_, i) => i)
```

---

### - [ ] 24. `sortFns.ts:168` — `[an, bn].sort()` to detect NaN order

**Problem:** Allocates a 2-element array per comparator call, then sorts it.

**Current:**

```ts
// packages/table-core/src/fns/sortFns.ts:168-184
const combo = [an, bn].sort()

if (isNaN(combo[0]!)) {
  if (aa > bb) return 1
  if (bb > aa) return -1
  continue
}

if (isNaN(combo[1]!)) {
  return isNaN(an) ? -1 : 1
}
```

**Proposed:**

```ts
const aIsNaN = isNaN(an)
const bIsNaN = isNaN(bn)
if (aIsNaN && bIsNaN) {
  if (aa > bb) return 1
  if (bb > aa) return -1
  continue
}
if (aIsNaN || bIsNaN) {
  return aIsNaN ? -1 : 1
}
```

---

### - [ ] 25. `rowExpandingFeature.utils.ts:219-222` — `id.split('.').length` to count dots

**Problem:** Allocates an array just to read its length.

**Current:**

```ts
// packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts:219-222
rowIds.forEach((id) => {
  const splitId = id.split('.')
  maxDepth = Math.max(maxDepth, splitId.length)
})
```

**Proposed:**

```ts
for (const id of rowIds) {
  let depth = 1
  for (let i = 0; i < id.length; i++)
    if (id.charCodeAt(i) === 46 /* . */) depth++
  if (depth > maxDepth) maxDepth = depth
}
```

---

### - [ ] 26. `columnResizingFeature.utils.ts:320-343` — `passiveEventSupported()` cache is broken

**Problem:** The cache variable `passiveSupported` is re-declared inside the function body, so the early-return check is always false. Each call adds and removes a real DOM event listener. Lift the cache to module scope so the second call onward is free.

**Current:**

```ts
// packages/table-core/src/features/column-resizing/columnResizingFeature.utils.ts:320-343
export function passiveEventSupported() {
  let passiveSupported: boolean | null = null

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

**Proposed:**

```ts
let passiveSupportedCache: boolean | null = null

export function passiveEventSupported() {
  if (passiveSupportedCache !== null) return passiveSupportedCache

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
  } catch {
    supported = false
  }
  passiveSupportedCache = supported
  return passiveSupportedCache
}
```

---

### - [ ] 27. `utils.ts:88-107` — `flattenBy` allocates a fresh closure on every call

**Problem:** Inner `recurse` closure is recreated each call. Also `forEach` adds dispatch overhead vs a `for` loop.

**Current:**

```ts
// packages/table-core/src/utils.ts:88-107
export function flattenBy<TNode>(
  arr: Array<TNode>,
  getChildren: (item: TNode) => Array<TNode>,
) {
  const flat: Array<TNode> = []

  const recurse = (subArr: Array<TNode>) => {
    subArr.forEach((item) => {
      flat.push(item)
      const children = getChildren(item)
      if (children.length) {
        recurse(children)
      }
    })
  }

  recurse(arr)
  return flat
}
```

**Proposed:**

```ts
function flattenInto<TNode>(
  out: Array<TNode>,
  arr: Array<TNode>,
  getChildren: (item: TNode) => Array<TNode>,
) {
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]!
    out.push(item)
    const children = getChildren(item)
    if (children.length) flattenInto(out, children, getChildren)
  }
}

export function flattenBy<TNode>(
  arr: Array<TNode>,
  getChildren: (item: TNode) => Array<TNode>,
) {
  const flat: Array<TNode> = []
  flattenInto(flat, arr, getChildren)
  return flat
}
```

---

### - [ ] 28. Recursive `forEach` patterns — convert to `for…of`

**Problem:** Pure micro-win. `for…of` skips the per-element callback dispatch.

**Locations:**

- `packages/table-core/src/features/row-pagination/createPaginatedRowModel.ts:73-80`
- `packages/table-core/src/features/row-expanding/createExpandedRowModel.ts:67-75`
- `packages/table-core/src/core/columns/coreColumnsFeature.utils.ts` (various)

**Current (representative):**

```ts
const handleRow = (row: Row<TFeatures, TData>) => {
  paginatedRowModel.flatRows.push(row)
  if (row.subRows.length) {
    row.subRows.forEach(handleRow)
  }
}
paginatedRowModel.rows.forEach(handleRow)
```

**Proposed:**

```ts
const handleRow = (row: Row<TFeatures, TData>) => {
  paginatedRowModel.flatRows.push(row)
  if (row.subRows.length) {
    for (const sub of row.subRows) handleRow(sub)
  }
}
for (const row of paginatedRowModel.rows) handleRow(row)
```

---

## Follow-up gaps from table-core scan

These were not already covered above. They are listed in worth-doing order within this follow-up set.

### - [ ] 29. `constructRow.ts:59` — `Object.values(table._features)` runs for every row

**Problem:** `constructRow` is called during core row-model creation and again when filtered/grouped row models clone rows. It allocates a fresh feature array for every row just to call optional per-row initialization hooks.

**Current:**

```ts
// packages/table-core/src/core/rows/constructRow.ts:59-61
for (const feature of Object.values(table._features)) {
  feature.initRowInstanceData?.(row)
}
```

**Proposed:**

```ts
// Option A: cache a private feature list on the table during constructTable.
for (const feature of table._featuresList) {
  feature.initRowInstanceData?.(row)
}

// Option B: if no cached list is added, avoid Object.values allocation.
for (const key in table._features) {
  table._features[key]!.initRowInstanceData?.(row)
}
```

The same allocation pattern exists in prototype builders (`constructColumn`, `constructCell`, `constructHeader`, `getRowPrototype`), but `constructRow` is the important hot path.

---

### - [x] 30. `columnSizingFeature.utils.ts:94-135` — `getIndex` plus `slice().reduce()` for offsets

**Problem:** `column_getStart` and `column_getAfter` first scan for the column index, then allocate a sliced array and reduce it. A single loop can compute the offset and avoid the extra array.

**Current:**

```ts
// packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts:101-103
return visibleLeafColumns
  .slice(0, callMemoOrStaticFn(column, 'getIndex', column_getIndex, position))
  .reduce((sum: number, c) => sum + column_getSize(c), 0)
```

```ts
// packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts:131-135
return visibleLeafColumns
  .slice(callMemoOrStaticFn(column, 'getIndex', column_getIndex, position) + 1)
  .reduce((sum: number, c) => sum + column_getSize(c), 0)
```

**Proposed:**

```ts
let start = 0
for (const c of visibleLeafColumns) {
  if (c.id === column.id) break
  start += column_getSize(c)
}
return start
```

For `getAfter`, walk once, start summing only after the target column is seen.

---

### - [ ] 31. `rowSelectionFeature.utils.ts` — `Object.keys(...).length` for empty/count checks

**Problem:** Several selected-row APIs allocate a full keys array just to check emptiness or count selected ids. These are table-level APIs that can run during render, and row selection state can be large.

**Locations:**

- `packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts:172`
- `packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts:199`
- `packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts:226`
- `packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts:255`
- `packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts:316-318`

**Current:**

```ts
if (!Object.keys(table.atoms.rowSelection?.get() ?? {}).length) {
  return { rows: [], flatRows: [], rowsById: {} }
}
```

```ts
const totalSelected = Object.keys(table.atoms.rowSelection?.get() ?? {}).length
```

**Proposed:**

```ts
function hasKeys(obj: Record<string, unknown>) {
  for (const key in obj) return true
  return false
}

function countKeys(obj: Record<string, unknown>) {
  let count = 0
  for (const key in obj) count++
  return count
}
```

Use `hasKeys` for emptiness checks and `countKeys` only where the exact selected count is needed.

---

### - [ ] 32. `aggregationFns.ts` — remaining callback/temporary-array aggregation paths

**Problem:** Items 13 and 14 cover `unique` and `median`, but the other built-in aggregation functions still use callback-based iteration or temporary arrays. These functions are invoked during grouped row-model aggregation.

**Locations:**

- `packages/table-core/src/fns/aggregationFns.ts:20-23` (`sum` via `reduce`)
- `packages/table-core/src/fns/aggregationFns.ts:39-49` (`min` via `forEach`)
- `packages/table-core/src/fns/aggregationFns.ts:67-76` (`max` via `forEach`)
- `packages/table-core/src/fns/aggregationFns.ts:95-105` (`extent` via `forEach`)
- `packages/table-core/src/fns/aggregationFns.ts:123-135` (`mean` via `forEach`)
- `packages/table-core/src/fns/aggregationFns.ts:192` (`uniqueCount` via `map` into `Set`)

**Current (representative):**

```ts
return childRows.reduce((sumValue, next) => {
  const nextValue = next.getValue(columnId)
  return sumValue + (typeof nextValue === 'number' ? nextValue : 0)
}, 0)
```

```ts
return new Set(leafRows.map((d) => d.getValue(columnId))).size
```

**Proposed:**

```ts
let sumValue = 0
for (const row of childRows) {
  const nextValue = row.getValue(columnId)
  if (typeof nextValue === 'number') sumValue += nextValue
}
return sumValue
```

```ts
const set = new Set<unknown>()
for (const row of leafRows) set.add(row.getValue(columnId))
return set.size
```

---

### - [ ] 33. `createGroupedRowModel.ts` — remaining grouping scans

**Problem:** Item 19 covers `Array.from(rowGroupsMap.entries()).map`, but `groupBy` still uses `reduce`, and grouped row `getValue` uses `existingGrouping.includes(colId)`. For wide grouping configs, a transient `Set` avoids repeated linear membership checks.

**Current:**

```ts
// packages/table-core/src/features/column-grouping/createGroupedRowModel.ts:141
if (existingGrouping.includes(colId)) {
  ...
}
```

```ts
// packages/table-core/src/features/column-grouping/createGroupedRowModel.ts:210-219
return rows.reduce((map, row) => {
  const resKey = `${row_getGroupingValue(row, columnId)}`
  const previous = map.get(resKey)
  if (!previous) {
    map.set(resKey, [row])
  } else {
    previous.push(row)
  }
  return map
}, groupMap)
```

**Proposed:**

```ts
const existingGroupingSet = new Set(existingGrouping)
// then inside getValue:
if (existingGroupingSet.has(colId)) {
  ...
}
```

```ts
for (const row of rows) {
  const resKey = `${row_getGroupingValue(row, columnId)}`
  const previous = groupMap.get(resKey)
  if (previous) previous.push(row)
  else groupMap.set(resKey, [row])
}
return groupMap
```

---

### - [ ] 34. `buildHeaderGroups.ts` — remaining small header-build allocations

**Problem:** Items 1 and 10 cover the larger header-build allocations, but `constructHeaderGroup` still allocates arrays for id construction and counts placeholder ids by filtering all pending parents.

**Current:**

```ts
// packages/table-core/src/core/headers/buildHeaderGroups.ts:62
id: [headerFamily, `${depth}`].filter(Boolean).join('_'),
```

```ts
// packages/table-core/src/core/headers/buildHeaderGroups.ts:98-103
id: [headerFamily, depth, column.id, headerToGroup.id]
  .filter(Boolean)
  .join('_'),
placeholderId: isPlaceholder
  ? `${pendingParentHeaders.filter((d) => d.column === column).length}`
  : undefined,
```

**Proposed:**

```ts
id: headerFamily ? `${headerFamily}_${depth}` : `${depth}`,
```

```ts
const id = headerFamily
  ? `${headerFamily}_${depth}_${column.id}_${headerToGroup.id}`
  : `${depth}_${column.id}_${headerToGroup.id}`

let placeholderCount = 0
if (isPlaceholder) {
  for (const pending of pendingParentHeaders) {
    if (pending.column === column) placeholderCount++
  }
}
```

---

### - [ ] 35. `columnPinningFeature.utils.ts` — state-update membership checks use nested `includes`

**Problem:** Item 11 covers center-cell/column derivation, but the state update path in `column_pin` also filters existing pinning arrays using `columnIds.includes(d)`. For grouped columns, this is O(existing pinned ids x target leaf ids) and allocates via chained `map().filter()`.

**Current:**

```ts
// packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts:59-84
const columnIds = column
  .getLeafColumns()
  .map((d) => d.id)
  .filter(Boolean)

return {
  left: old.left.filter((d) => !columnIds.includes(d)),
  right: old.right.filter((d) => !columnIds.includes(d)),
}
```

**Proposed:**

```ts
const columnIds: Array<string> = []
const columnIdSet = new Set<string>()
for (const leafColumn of column.getLeafColumns()) {
  if (!leafColumn.id) continue
  columnIds.push(leafColumn.id)
  columnIdSet.add(leafColumn.id)
}

const left = old.left.filter((id) => !columnIdSet.has(id))
const right = old.right.filter((id) => !columnIdSet.has(id))
```

---

## Likely bugs noticed in passing (not perf, but worth flagging)

### - [ ] B1. `rowExpandingFeature.utils.ts:333` — wrong variable in `row_getIsAllParentsExpanded`

**Problem:** Walks up the tree via `currentRow`, but checks the _original_ `row` for expansion every iteration. The function never actually inspects ancestors.

**Current:**

```ts
// packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts:328-336
let isFullyExpanded = true
let currentRow = row

while (isFullyExpanded && currentRow.parentId) {
  currentRow = row.table.getRow(currentRow.parentId, true)
  isFullyExpanded = row_getIsExpanded(row) // ← uses `row`
}

return isFullyExpanded
```

**Proposed:**

```ts
isFullyExpanded = row_getIsExpanded(currentRow)
```

---

### - [ ] B2. `rowSortingFeature.utils.ts:89` — `slice(10)` skips the first 10 instead of taking them

**Problem:** Auto sort-fn detection appears to want the first 10 rows for sampling, but `slice(10)` yields rows 10..end. With short tables this returns `[]` and detection falls through to defaults.

**Current:**

```ts
// packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts:89
const firstRows = column.table.getFilteredRowModel().flatRows.slice(10)
```

**Proposed:**

```ts
const firstRows = column.table.getFilteredRowModel().flatRows.slice(0, 10)
```

---

### - [ ] B3. `createFilteredRowModel.ts:127-131, 145-149` — ternary precedence drops the assignment

**Problem:** When `row.columnFiltersMeta` is falsy, the meta object is _initialized_ but the actual `filterMeta` value is never written. When it's already truthy, the value is written. The intended behavior is "ensure object exists, then write the value".

**Current:**

```ts
// packages/table-core/src/features/column-filtering/createFilteredRowModel.ts:127-131
;(filterMeta) => {
  !row.columnFiltersMeta
    ? (row.columnFiltersMeta = {})
    : (row.columnFiltersMeta[id] = filterMeta)
}
```

**Proposed:**

```ts
;(filterMeta) => {
  if (!row.columnFiltersMeta) row.columnFiltersMeta = {}
  row.columnFiltersMeta[id] = filterMeta
}
```

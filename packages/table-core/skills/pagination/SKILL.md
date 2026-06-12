---
name: pagination
description: >
  Paginate rows in TanStack Table v9 with the `paginatedRowModel` stage. Covers
  `rowPaginationFeature` + `createPaginatedRowModel()`, `state.pagination`
  ({ pageIndex, pageSize }), `onPaginationChange`, `manualPagination`,
  `rowCount` and `pageCount` for server-side, `autoResetPageIndex`,
  `paginateExpandedRows`, navigation APIs (`nextPage`/`previousPage`/`firstPage`/
  `lastPage`/`setPageIndex`/`setPageSize`), `getCanNextPage` / `getCanPreviousPage`,
  `getPageCount` / `getRowCount` / `getPageOptions`, and `getPrePaginatedRowModel`
  for "total filtered" counts.
type: core
library: tanstack-table
library_version: '9.0.0-alpha.48'
requires:
  - state-management
sources:
  - TanStack/table:docs/guide/pagination.md
  - TanStack/table:packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts
  - TanStack/table:packages/table-core/src/features/row-pagination/createPaginatedRowModel.ts
  - TanStack/table:examples/react/pagination/src/main.tsx
---

This skill builds on `tanstack-table/state-management`. Read it first for the atom model and `manual*` mode.

## Setup

```ts
import {
  tableFeatures,
  rowPaginationFeature,
  createPaginatedRowModel,
  constructTable,
} from '@tanstack/table-core'
import type { PaginationState } from '@tanstack/table-core'

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

const table = constructTable({
  features,
  columns,
  data,
  initialState: {
    pagination: { pageIndex: 0, pageSize: 10 } satisfies PaginationState,
  },
})

table.nextPage()
table.setPageIndex(5)
table.setPageSize(25)
table.getCanNextPage()
table.getPageCount()
table.getRowCount()
```

## Core Patterns

### Pagination toolbar

```tsx
// From examples/react/pagination/src/main.tsx
<div>
  <button
    onClick={() => table.firstPage()}
    disabled={!table.getCanPreviousPage()}
  >
    {'<<'}
  </button>
  <button
    onClick={() => table.previousPage()}
    disabled={!table.getCanPreviousPage()}
  >
    {'<'}
  </button>
  <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
    {'>'}
  </button>
  <button onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
    {'>>'}
  </button>

  <span>
    Page {table.store.state.pagination.pageIndex + 1} of{' '}
    {table.getPageCount().toLocaleString()}
  </span>

  <span>
    | Go to page:
    <input
      type="number"
      defaultValue={table.store.state.pagination.pageIndex + 1}
      onChange={(e) => {
        const page = e.target.value ? Number(e.target.value) - 1 : 0
        table.setPageIndex(page)
      }}
    />
  </span>

  <select
    value={table.store.state.pagination.pageSize}
    onChange={(e) => table.setPageSize(Number(e.target.value))}
  >
    {[10, 20, 30, 40, 50].map((size) => (
      <option key={size} value={size}>
        Show {size}
      </option>
    ))}
  </select>
</div>
```

### Server-side pagination

```tsx
const [pagination, setPagination] = useState<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
const { data: dataQuery } = useQuery({
  queryKey: ['rows', pagination],
  queryFn: () => fetchPage(pagination.pageIndex, pagination.pageSize),
})

const table = useTable({
  features: tableFeatures({ rowPaginationFeature }),
  // no paginatedRowModel registered — server paginates
  data: dataQuery?.rows ?? EMPTY,
  columns,
  manualPagination: true,
  rowCount: dataQuery?.rowCount, // server-provided total
  // OR: pageCount: dataQuery.pageCount
  // OR: pageCount: -1 if unknown (next button stays enabled)
  state: { pagination },
  onPaginationChange: setPagination,
})
```

### Disable auto page reset when filters change

```ts
const features = tableFeatures({
  rowPaginationFeature,
  columnFilteringFeature,
  paginatedRowModel: createPaginatedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  filterFns,
})
const table = constructTable({
  features,
  columns,
  data,
  autoResetPageIndex: false, // keep current page while user types in a filter
})
```

`autoResetPageIndex` defaults to `!manualPagination` — true client-side, false manual.

### "Total filtered rows" display while paginated

```ts
const totalFiltered = table.getPrePaginatedRowModel().rows.length
const onCurrentPage = table.getRowModel().rows.length
```

`getPrePaginatedRowModel` is the row model AFTER filtering/sorting/grouping/expansion but BEFORE the page slice.

## Common Mistakes

### [HIGH] Setting `manualPagination: true` without supplying `rowCount` or `pageCount`

Wrong:

```tsx
// getPageCount() returns 1, next/prev buttons are disabled
const table = useTable({
  features: tableFeatures({ rowPaginationFeature }),
  data, // only 10 rows for the current page
  columns,
  manualPagination: true,
  state: { pagination },
  onPaginationChange: setPagination,
  // missing: rowCount or pageCount
})
```

Correct:

```tsx
const table = useTable({
  features: tableFeatures({ rowPaginationFeature }),
  data: dataQuery.rows,
  columns,
  manualPagination: true,
  rowCount: dataQuery.rowCount, // server tells the table the total
  // OR: pageCount: dataQuery.pageCount
  // OR: pageCount: -1 if unknown
  state: { pagination },
  onPaginationChange: setPagination,
})
```

`getRowCount()` defaults to `getPrePaginatedRowModel().rows.length` — which in manual mode is only the current page. Without `rowCount`/`pageCount`, the table thinks there's one page total.

Source: packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts

### [MEDIUM] Putting `pagination` in BOTH `state` and `initialState`

Wrong:

```tsx
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
const table = useTable({
  initialState: { pagination: { pageSize: 25 } }, // IGNORED
  state: { pagination }, // wins (pageSize 10)
  onPaginationChange: setPagination,
})
```

Correct:

```tsx
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 })
const table = useTable({
  features: tableFeatures({
    rowPaginationFeature,
    paginatedRowModel: createPaginatedRowModel(),
  }),
  columns,
  data,
  state: { pagination },
  onPaginationChange: setPagination,
})
```

`state` always overrides `initialState`. Seed the controlled state in `useState` or use `initialState` alone — never both.

Source: docs/guide/pagination.md

### [MEDIUM] `autoResetPageIndex: false` without manual clamping leaves empty pages

Wrong:

```ts
// features already has paginatedRowModel + filteredRowModel registered
const table = useTable({
  features,
  columns,
  data,
  autoResetPageIndex: false, // user on page 5, then filters down to 2 pages
  // → page 5 is empty. No automatic clamp.
})
```

Correct:

```ts
// Either leave autoResetPageIndex default (true) for client-side,
// or clamp manually after a data-altering effect:
useEffect(() => {
  const lastPage = Math.max(0, table.getPageCount() - 1)
  if (table.atoms.pagination.get().pageIndex > lastPage) {
    table.setPageIndex(lastPage)
  }
}, [data, columnFilters])
```

`setPageIndex` only clamps against `options.pageCount` (max safe int when unset). It doesn't clamp against the current row model.

Source: packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts

### [LOW] Expecting `getRowCount()` to equal `data.length` under filtering/grouping/expansion

Wrong:

```ts
console.log(table.getRowCount()) // count after all transforms
console.log(data.length) // raw input count
// These diverge under filtering, grouping, or tree vs flat input.
```

Correct:

```ts
table.getCoreRowModel().rows.length // raw row count (flat)
table.getPreFilteredRowModel().rows.length // before filtering
table.getFilteredRowModel().rows.length // after filtering
table.getRowCount() // pre-paginated count (or `rowCount` option in manual mode)
table.getRowModel().rows.length // current page only
```

`getRowCount` returns `options.rowCount ?? getPrePaginatedRowModel().rows.length`. Pick the model that matches the question.

Source: docs/guide/row-models.md

### [HIGH] `getToggleAllRowsSelectedHandler` only selects current page under server pagination

Wrong:

```tsx
// Header checkbox only affects current page in manualPagination mode
<input
  checked={table.getIsAllRowsSelected()}
  onChange={table.getToggleAllRowsSelectedHandler()}
/>
```

Correct:

```tsx
// Use page-aware APIs with server pagination
<input
  checked={table.getIsAllPageRowsSelected()}
  onChange={table.getToggleAllPageRowsSelectedHandler()}
/>
// For "select all server-side rows", track a separate "all rows mode"
// boolean alongside the row map.
```

The table only knows about the current page's rows under `manualPagination`. "Select all" can never mean "every row on the server" without an explicit out-of-band selection mode.

Source: https://github.com/TanStack/table/issues/4781

### [MEDIUM] `autoResetPageIndex` resets to `initialState.pageIndex` (not 0)

Wrong:

```ts
// Filtering data resets to the deep-linked pageIndex, not 0
const table = useTable({
  data,
  columns,
  initialState: { pagination: { pageIndex: 5, pageSize: 10 } },
  autoResetPageIndex: true,
})
```

Correct:

```ts
useEffect(() => {
  table.setPageIndex(0)
}, [columnFilters, globalFilter])
// Or: don't rely on autoResetPageIndex when deep-linking pageIndex
```

`_autoResetPageIndex` calls `resetPageIndex()` without `true`, which restores to `initialState.pagination.pageIndex` — typically a URL deep-link page that's now invalid.

Source: https://github.com/TanStack/table/issues/6207

### [CRITICAL] Reimplementing pagination math manually

Wrong:

```ts
// Hand-rolled page slicing instead of using the API
const paginatedRows = useMemo(
  () => allRows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
  [allRows, pageIndex, pageSize],
)
```

Correct:

```ts
const table = useTable({
  features: tableFeatures({
    rowPaginationFeature,
    paginatedRowModel: createPaginatedRowModel(),
  }),
  columns,
  data,
})
// table.nextPage(), table.setPageIndex(...), table.getRowModel().rows
```

The built-in APIs honor `autoResetPageIndex`, `paginateExpandedRows`, and reset interactions across other features.

Source: maintainer interview (Phase 4, 2026-05-17)

## See also

- `tanstack-table/state-management` — `manualPagination` + `autoResetAll`
- `tanstack-table/row-expanding` — `paginateExpandedRows` interaction
- `tanstack-table/row-selection` — "select all" pitfalls under server pagination

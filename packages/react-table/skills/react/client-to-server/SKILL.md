---
name: react/client-to-server
description: >
  Convert a client-side `@tanstack/react-table` v9 table to server-side
  (manual modes). Pass server-paginated/sorted/filtered rows as `data`, set
  `manualPagination` / `manualSorting` / `manualFiltering` / `manualGrouping` /
  `manualExpanding` for whatever the server now owns, supply `rowCount` so
  `getPageCount()` works, and DROP the matching factory from `tableFeatures()` (no
  `paginatedRowModel` slot if the server paginates). Own the relevant state slices
  via external atoms (`useCreateAtom` + `options.atoms`) so a query can key on
  the slice and refetch automatically — OR via classic `state` + `on*Change`
  controlled state.
type: lifecycle
library: tanstack-table
framework: react
library_version: '9.0.0-alpha.48'
requires:
  - state-management
  - pagination
  - filtering
  - sorting
  - react/table-state
sources:
  - TanStack/table:examples/react/basic-external-atoms/src/main.tsx
  - TanStack/table:examples/react/with-tanstack-query/src/main.tsx
  - TanStack/table:examples/react/with-tanstack-query/src/fetchData.ts
---

This skill builds on `tanstack-table/state-management` and `tanstack-table/react/table-state`. Read those first — the atom model is what makes the cleanest server-side wiring possible.

## Why "client-to-server"

A client-side table sees every row, sorts/filters/paginates them locally, and renders a slice. A server-side table sees only the slice the server returned for the current request; the table must be told "don't try to slice this again — and here's the total row count so you can render a pager".

Four moves convert any client table to a server table:

1. **`manualX: true`** for whichever operations the server owns.
2. **Drop the matching factory** from `tableFeatures()` so it doesn't ship in your bundle.
3. **Provide `rowCount`** so `table.getPageCount()` / `getCanNextPage()` work.
4. **Own the slice state externally** so your data fetcher can key on it.

## Setup

Two state-ownership patterns work; pick one per slice.

### Pattern A — external atom (cleanest with Query/SWR)

```tsx
import * as React from 'react'
import { useCreateAtom, useSelector } from '@tanstack/react-store'
import {
  useTable,
  tableFeatures,
  rowPaginationFeature,
  createColumnHelper,
} from '@tanstack/react-table'
import type { PaginationState } from '@tanstack/react-table'

const features = tableFeatures({ rowPaginationFeature })
const columnHelper = createColumnHelper<typeof features, Person>()
const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { header: 'First' }),
  columnHelper.accessor('age', { header: 'Age' }),
])

const EMPTY: Person[] = []

function ServerTable() {
  // 1) Own pagination in an external atom.
  const paginationAtom = useCreateAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const pagination = useSelector(paginationAtom)

  // 2) Fetch keyed on the atom value.
  const [serverPage, setServerPage] = React.useState<{
    rows: Person[]
    rowCount: number
  } | null>(null)
  React.useEffect(() => {
    let cancelled = false
    fetchPeople(pagination).then((page) => {
      if (!cancelled) setServerPage(page)
    })
    return () => {
      cancelled = true
    }
  }, [pagination])

  // 3) Manual pagination + rowCount. No paginatedRowModel in features.
  const table = useTable({
    features,
    columns,
    data: serverPage?.rows ?? EMPTY, // EMPTY at module scope
    rowCount: serverPage?.rowCount,
    atoms: { pagination: paginationAtom }, // table writes here directly
    manualPagination: true,
  })
  // No onPaginationChange — table.setPageIndex(...) writes through the atom.
}
```

Source: `examples/react/basic-external-atoms/src/main.tsx` (atoms wiring); `examples/react/with-tanstack-query/src/main.tsx` (rowCount + manualPagination).

### Pattern B — classic `state` + `on*Change`

```tsx
const [pagination, setPagination] = React.useState<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const table = useTable({
  features,
  columns,
  data: serverPage?.rows ?? EMPTY,
  rowCount: serverPage?.rowCount,
  state: { pagination },
  onPaginationChange: setPagination, // REQUIRED with state.pagination
  manualPagination: true,
})
```

Both work. `state` + `on*Change` is familiar from v8; atoms compose more cleanly with Query (the table writes to the atom, the query key includes the atom value, the query refetches automatically).

## Core Patterns

### Combining server-side sort + filter + pagination

Add the matching `manual*` flags for each operation the server now owns. Local features (column visibility, ordering, pinning) still work because they don't depend on the row model.

```tsx
const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  columnVisibilityFeature, // still local
  columnPinningFeature, // still local
})

const sortingAtom = useCreateAtom<SortingState>([])
const paginationAtom = useCreateAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
const columnFiltersAtom = useCreateAtom<ColumnFiltersState>([])

const sorting = useSelector(sortingAtom)
const pagination = useSelector(paginationAtom)
const columnFilters = useSelector(columnFiltersAtom)

const serverArgs = { sorting, pagination, columnFilters }
// ... fetch keyed on serverArgs

const table = useTable({
  features, // no sorted/filtered/paginated factories — server owns them
  columns,
  data: serverPage?.rows ?? EMPTY,
  rowCount: serverPage?.rowCount,
  atoms: {
    sorting: sortingAtom,
    pagination: paginationAtom,
    columnFilters: columnFiltersAtom,
  },
  manualSorting: true,
  manualFiltering: true,
  manualPagination: true,
})
```

Source: `examples/react/basic-external-atoms/src/main.tsx`.

### When NOT to manual-mode a slice

If the server returns the **entire** dataset, leave the table client-side. Manual mode is for slices the server has already trimmed.

## Common Mistakes

### CRITICAL Forgetting `manualPagination` / `manualSorting` / `manualFiltering`

Wrong:

```tsx
const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(), // factory registered — but server already paginated
})
const table = useTable({
  features,
  columns,
  data: serverPage.rows,
  // missing manualPagination
})
```

Correct:

```tsx
const features = tableFeatures({
  rowPaginationFeature,
  // no paginatedRowModel — server paginates
})
const table = useTable({
  features,
  columns,
  data: serverPage.rows,
  rowCount: serverPage.rowCount,
  manualPagination: true,
})
```

Without `manualPagination: true`, the table tries to slice the already-server-sliced page a second time, producing rows that don't exist (or visibly wrong pagination).
Source: `examples/react/with-tanstack-query/src/main.tsx`.

### CRITICAL Missing `rowCount`

Wrong:

```tsx
const table = useTable({
  features,
  columns,
  data: serverPage.rows,
  manualPagination: true,
  // missing rowCount: serverPage.totalRowCount
})
// table.getPageCount() → 1, pager locks at "Page 1 of 1"
```

Correct:

```tsx
const table = useTable({
  features,
  columns,
  data: serverPage.rows,
  rowCount: serverPage.rowCount, // ← required for accurate pager
  manualPagination: true,
})
```

Without `rowCount`, `getPageCount()` falls back to `Math.ceil(data.length / pageSize)` — which is 1 if the server returned a single page.
Source: `examples/react/with-tanstack-query/src/main.tsx`.

### HIGH `state.pagination` without `onPaginationChange`

Wrong:

```tsx
const [pagination] = React.useState<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
useTable({
  features,
  columns,
  data,
  state: { pagination },
  // missing onPaginationChange — table.setPageIndex is a no-op
  manualPagination: true,
})
```

Correct:

```tsx
const [pagination, setPagination] = React.useState<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
useTable({
  features,
  columns,
  data,
  state: { pagination },
  onPaginationChange: setPagination, // ← required
  manualPagination: true,
})
// OR — use atoms.pagination instead, which doesn't need a writeback handler.
```

The library treats `state` as controlled; without a writeback handler, `table.setPageIndex(...)` writes nowhere.
Source: `docs/framework/react/guide/table-state.md`.

### HIGH Leaving `paginatedRowModel` registered for a server-paginated table

Wrong:

```tsx
const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(), // ships for nothing
})
useTable({
  features,
  columns,
  data: serverPage.rows,
  manualPagination: true,
})
```

Correct:

```tsx
const features = tableFeatures({
  rowPaginationFeature,
  // drop paginatedRowModel — server owns pagination
})
useTable({
  features,
  columns,
  data: serverPage.rows,
  rowCount: serverPage.rowCount,
  manualPagination: true,
})
```

The factory ships in your bundle for no reason. Manual mode + the factory will also let the factory re-slice your already-sliced server page if `manualPagination` is ever flipped off.
Source: maintainer guidance.

### HIGH Mixing `state.X` and `atoms.X` for the same slice

Wrong:

```tsx
useTable({
  features,
  columns,
  data,
  state: { pagination }, // silently ignored
  onPaginationChange: setPagination, // silently ignored
  atoms: { pagination: paginationAtom }, // wins
  manualPagination: true,
})
```

Correct:

```tsx
// Pick one ownership mechanism per slice.
useTable({
  features,
  columns,
  data,
  atoms: { pagination: paginationAtom },
  manualPagination: true,
})
```

Precedence is `options.atoms[key]` > `options.state[key]` > internal. The `state` plumbing is dead code in this configuration.
Source: `examples/react/basic-external-atoms/src/main.tsx`.

### MEDIUM Recreating `data` array identity in JSX

Wrong:

```tsx
<MyTable data={query.data?.rows ?? []} columns={columns} />
// `?? []` produces a new array reference each render → internal memos bust
```

Correct:

```tsx
const EMPTY: Person[] = []   // module scope

<MyTable data={query.data?.rows ?? EMPTY} columns={columns} />
// or wrap in useMemo
```

Internal memoization keys off identity. A fresh `[]` each render bypasses memos and may force re-computation.
Source: maintainer guidance; `examples/react/with-tanstack-query/src/main.tsx`.

## See Also

- `tanstack-table/react/compose-with-tanstack-query` — the canonical Query + server-side pattern.
- `tanstack-table/react/compose-with-tanstack-store` — sharing slice atoms across components.
- `tanstack-table/react/table-state` — selectors, `<Subscribe>`, external atoms.
- `tanstack-table/react/production-readiness` — when to narrow selectors as the table grows.

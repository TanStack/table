# React Table with TanStack Query

Use this reference when Query owns server data for a React table. Read [table state](../../table-state/SKILL.md) for reactive ownership. Run `intent load @tanstack/table-core#table-features` and read its client/server reference before choosing manual processing stages. Query fetches rows already processed by every server-owned stage; manual flags only bypass Table processing.

## Setup

```tsx
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useCreateAtom, useSelector } from '@tanstack/react-store'
import {
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import type { PaginationState } from '@tanstack/react-table'

const features = tableFeatures({ rowPaginationFeature })
const emptyRows: Array<{ id: string }> = []

function ServerTable() {
  const paginationAtom = useCreateAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })
  const pagination = useSelector(paginationAtom, (value) => value)
  const result = useQuery({
    queryKey: ['people', pagination],
    queryFn: async () =>
      fetch(
        `/api/people?page=${pagination.pageIndex}&size=${pagination.pageSize}`,
      ).then(
        (r) =>
          r.json() as Promise<{
            rows: Array<{ id: string }>
            rowCount: number
          }>,
      ),
    placeholderData: keepPreviousData,
  })
  return useTable({
    features,
    columns,
    data: result.data?.rows ?? emptyRows,
    rowCount: result.data?.rowCount,
    atoms: { pagination: paginationAtom },
    manualPagination: true,
  })
}
```

## Core patterns

### Put every server-owned slice in the key

```tsx
const result = useQuery({
  queryKey: ['people', pagination, sorting, columnFilters],
  queryFn: () => fetchPeople({ pagination, sorting, columnFilters }),
})
```

### Feed the query result directly to Table

```tsx
const table = useTable({
  features,
  columns,
  data: result.data?.rows ?? emptyRows,
})
```

## Common mistakes

### HIGH Duplicating query rows into state

Wrong:

```tsx
useEffect(() => setRows(result.data?.rows ?? []), [result.data])
const table = useTable({ features, columns, data: rows })
```

Correct:

```tsx
const table = useTable({
  features,
  columns,
  data: result.data?.rows ?? emptyRows,
})
```

The second state layer can lag behind the query cache and creates an extra synchronization path.

Source: `examples/react/with-tanstack-query`

### HIGH Omitting state from the query key

Wrong:

```tsx
useQuery({ queryKey: ['people'], queryFn: () => fetchPeople({ pagination }) })
```

Correct:

```tsx
useQuery({
  queryKey: ['people', pagination],
  queryFn: () => fetchPeople({ pagination }),
})
```

Query otherwise reuses cache entries for different server requests.

Source: `examples/react/with-tanstack-query`

### HIGH Expecting manual mode to fetch

Wrong:

```tsx
useTable({ features, columns, data, manualPagination: true })
```

Correct:

```tsx
useTable({
  features,
  columns,
  data: result.data?.rows ?? emptyRows,
  rowCount: result.data?.rowCount,
  manualPagination: true,
})
```

`manualPagination` only bypasses client pagination; the application must fetch a processed page and provide its total count.

Source: `docs/framework/react/guide/pagination.md`

### Choose the loading transition

To show a loading transition for each page:

```tsx
useQuery({
  queryKey: ['people', pagination],
  queryFn: () => fetchPeople({ pagination }),
})
```

To keep the previous page visible while fetching:

```tsx
useQuery({
  queryKey: ['people', pagination],
  queryFn: () => fetchPeople({ pagination }),
  placeholderData: keepPreviousData,
})
```

Preserve the previous page intentionally when an empty loading transition is undesirable.

Source: `examples/react/with-tanstack-query`

## API discovery

Inspect `node_modules/@tanstack/react-table/dist/index.d.ts` and the relevant installed core feature declarations; inspect the installed `@tanstack/react-query` declarations for current query option types.

## Sources

- `TanStack/table:examples/react/with-tanstack-query`
- `TanStack/table:examples/react/virtualized-infinite-scrolling`
- `TanStack/table:docs/framework/react/guide/pagination.md`

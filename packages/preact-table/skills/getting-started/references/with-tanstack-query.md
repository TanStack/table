# Preact Table with TanStack Query

Use this reference when Query owns server data for a Preact table. Read [table state](../../table-state/SKILL.md) for reactive ownership. Run `intent load @tanstack/table-core#table-features` and read its client/server reference before choosing manual processing stages. Query fetches rows already processed by every server-owned stage; manual flags only bypass Table processing.

## Setup

```tsx
import { keepPreviousData, useQuery } from '@tanstack/preact-query'
import { useCreateAtom, useSelector } from '@tanstack/preact-store'
import {
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'

const features = tableFeatures({ rowPaginationFeature })
const emptyRows: Array<{ id: string }> = []
const paginationAtom = useCreateAtom({ pageIndex: 0, pageSize: 20 })
const pagination = useSelector(paginationAtom, (value) => value)
const result = useQuery({
  queryKey: ['people', pagination],
  queryFn: () => fetchPeople(pagination),
  placeholderData: keepPreviousData,
})
const table = useTable({
  features,
  columns,
  data: result.data?.rows ?? emptyRows,
  rowCount: result.data?.rowCount,
  atoms: { pagination: paginationAtom },
  manualPagination: true,
})
```

## Core patterns

### Key requests by every server-owned slice

```tsx
useQuery({
  queryKey: ['people', pagination, sorting],
  queryFn: () => fetchPeople({ pagination, sorting }),
})
```

### Pass cached rows directly

```tsx
useTable({ features, columns, data: result.data?.rows ?? emptyRows })
```

## Common mistakes

### HIGH Importing React Query APIs

Wrong:

```tsx
import { useQuery } from '@tanstack/react-query'
```

Correct:

```tsx
import { useQuery } from '@tanstack/preact-query'
```

Use native Preact Query and Store integrations throughout the composition.

Source: `examples/preact/with-tanstack-query`

### HIGH Reusing one cache key

Wrong:

```tsx
useQuery({ queryKey: ['people'], queryFn: () => fetchPeople(pagination) })
```

Correct:

```tsx
useQuery({
  queryKey: ['people', pagination],
  queryFn: () => fetchPeople(pagination),
})
```

Each processed server result needs a key that includes its request state.

Source: `examples/preact/with-tanstack-query`

### HIGH Expecting manual flags to fetch

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

Manual pagination bypasses local processing; it neither calls the backend nor invents totals.

Source: `docs/framework/preact/guide/pagination.md`

## API discovery

Inspect installed `node_modules/@tanstack/preact-table/dist/index.d.ts` and the relevant installed core feature declarations; inspect `@tanstack/preact-query` declarations for exact query APIs.

## Sources

- `TanStack/table:examples/preact/with-tanstack-query`
- `TanStack/table:docs/framework/preact/guide/pagination.md`

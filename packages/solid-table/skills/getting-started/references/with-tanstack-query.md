# Solid Table with TanStack Query

Use this reference when Query owns server data for a Solid table. Read [table state](../../table-state/SKILL.md) for reactive ownership. Run `intent load @tanstack/table-core#table-features` and read its client/server reference before choosing manual processing stages. Query fetches rows already processed by every server-owned stage; manual flags only bypass Table processing.

## Setup

```tsx
import { keepPreviousData, useQuery } from '@tanstack/solid-query'
import { createAtom, useSelector } from '@tanstack/solid-store'
import {
  createTable,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/solid-table'

const features = tableFeatures({ rowPaginationFeature })
const emptyRows: Array<{ id: string }> = []
const paginationAtom = createAtom({ pageIndex: 0, pageSize: 20 })
const pagination = useSelector(paginationAtom)
const result = useQuery(() => ({
  queryKey: ['people', pagination()],
  queryFn: () => fetchPeople(pagination()),
  placeholderData: keepPreviousData,
}))
const table = createTable({
  features,
  columns,
  get data() {
    return result.data?.rows ?? emptyRows
  },
  get rowCount() {
    return result.data?.rowCount
  },
  atoms: { pagination: paginationAtom },
  manualPagination: true,
})
```

## Core patterns

### Track every server-owned slice

```tsx
const result = useQuery(() => ({
  queryKey: ['people', pagination(), sorting()],
  queryFn: () => fetchPeople({ pagination: pagination(), sorting: sorting() }),
}))
```

### Expose query results through getters

```tsx
const table = createTable({
  features,
  columns,
  get data() {
    return result.data?.rows ?? emptyRows
  },
})
```

## Common mistakes

### HIGH Snapshotting the query key

Wrong:

```tsx
useQuery({ queryKey: ['people', pagination()], queryFn: fetchPeople })
```

Correct:

```tsx
useQuery(() => ({
  queryKey: ['people', pagination()],
  queryFn: () => fetchPeople(pagination()),
}))
```

Solid Query's options factory tracks signals read while constructing the key and request.

Source: `examples/solid/with-tanstack-query`

### HIGH Copying React Query state glue

Wrong:

```tsx
useEffect(() => setRows(result.data?.rows ?? []), [result.data])
```

Correct:

```tsx
get data() { return result.data?.rows ?? emptyRows }
```

Solid getters connect the query result directly without a second synchronization layer.

Source: `examples/solid/with-tanstack-query`

### HIGH Expecting manual mode to process

Wrong:

```tsx
createTable({ features, columns, data, manualPagination: true })
```

Correct:

```tsx
createTable({
  features,
  columns,
  get data() {
    return result.data?.rows ?? emptyRows
  },
  get rowCount() {
    return result.data?.rowCount
  },
  manualPagination: true,
})
```

Manual pagination bypasses the client row model; it does not fetch, page, or count data.

Source: `docs/framework/solid/guide/pagination.md`

## API discovery

Inspect installed `node_modules/@tanstack/solid-table/dist/createTable.d.ts` and the relevant installed core feature declarations; inspect `@tanstack/solid-query` declarations for reactive option shapes.

## Sources

- `TanStack/table:examples/solid/with-tanstack-query`
- `TanStack/table:docs/framework/solid/guide/pagination.md`

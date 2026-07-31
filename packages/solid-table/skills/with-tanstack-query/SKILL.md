---
name: with-tanstack-query
description: >
  Compose Solid Query reactive options with Solid Table manual server processing. Load for tracked query-key signals, query result getters, server row counts, keepPreviousData, and avoiding React Query patterns or duplicated data state.
metadata:
  {
    type: composition,
    library: '@tanstack/solid-table',
    library_version: '9.0.0-beta.64',
    framework: solid,
  }
requires:
  ['@tanstack/table-core#client-vs-server', getting-started, table-state]
sources:
  - 'TanStack/table:examples/solid/with-tanstack-query'
  - 'TanStack/table:docs/framework/solid/guide/pagination.md'
---

This skill builds on `@tanstack/table-core#client-vs-server`, `getting-started`, and `table-state`. Query owns remote data; Table receives already processed rows for each manual stage.

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

## Core Patterns

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

## Common Mistakes

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

## API Discovery

Inspect installed `node_modules/@tanstack/solid-table/dist/createTable.d.ts` and the relevant core feature source; inspect `@tanstack/solid-query` source for reactive option shapes.

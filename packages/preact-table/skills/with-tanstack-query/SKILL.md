---
name: with-tanstack-query
description: >
  Compose native Preact Table v9 with @tanstack/preact-query using table state in query keys, manual server filtering/sorting/pagination, server counts, and stable query-result data. Load when React Query examples or manual* expectations are wrong for Preact.
metadata:
  {
    type: composition,
    library: '@tanstack/preact-table',
    library_version: '9.0.0-beta.53',
    framework: preact,
  }
requires:
  ['@tanstack/table-core#client-vs-server', getting-started, table-state]
sources:
  - 'TanStack/table:examples/preact/with-tanstack-query'
  - 'TanStack/table:docs/framework/preact/guide/pagination.md'
---

This skill builds on `@tanstack/table-core#client-vs-server`, `getting-started`, and `table-state`. Query fetches already processed rows; Table's manual flags only declare that boundary.

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

## Core Patterns

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

## Common Mistakes

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

## API Discovery

Inspect installed `node_modules/@tanstack/preact-table/dist/index.d.ts` and the relevant core feature source; inspect `@tanstack/preact-query` source for exact query APIs.

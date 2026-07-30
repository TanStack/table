---
name: with-tanstack-query
description: >
  Compose reactive Vue Query keys and results with Vue Table manual row processing, refs/computed state, server counts, and already-processed pages without duplicating query data into a drifting local ref.
metadata:
  type: composition
  library: '@tanstack/vue-table'
  framework: vue
  library_version: '9.0.0-beta.62'
requires:
  - '@tanstack/table-core#client-vs-server'
  - getting-started
  - table-state
sources:
  - 'TanStack/table:examples/vue/with-tanstack-query'
  - 'TanStack/table:docs/framework/vue/guide/pagination.md'
---

This skill builds on `@tanstack/table-core#client-vs-server`, `getting-started`, and `table-state`. Name each client- and server-owned processing stage first.

## Setup

```ts
import { computed, ref } from 'vue'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import {
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'

const pagination = ref({ pageIndex: 0, pageSize: 20 })
const query = useQuery(() => ({
  queryKey: ['people', pagination.value.pageIndex, pagination.value.pageSize],
  queryFn: () =>
    fetch(
      `/api/people?page=${pagination.value.pageIndex}&size=${pagination.value.pageSize}`,
    ).then((r) => r.json()),
  placeholderData: keepPreviousData,
}))
const data = computed(() => query.data.value?.rows ?? [])
const rowCount = computed(() => query.data.value?.rowCount ?? 0)
const state = computed(() => ({ pagination: pagination.value }))
const table = useTable({
  features: tableFeatures({ rowPaginationFeature }),
  columns,
  data,
  rowCount,
  manualPagination: true,
  state,
  onPaginationChange: (next) => {
    pagination.value =
      typeof next === 'function' ? next(pagination.value) : next
  },
})
```

## Core Patterns

### Keep query dependencies reactive

Use the Vue Query options function and read refs inside it. Include every manual filter/sort/page input in the query key.

### Pass Query results directly

Expose result fields as computed refs. Introduce a second local data ref only for an explicit editing workflow with a cache-write policy.

## Common Mistakes

### HIGH Unwrapping before query construction

Wrong:

```ts
const page = pagination.value.pageIndex
useQuery(() => ({ queryKey: ['people', page], queryFn }))
```

Correct:

```ts
useQuery(() => ({ queryKey: ['people', pagination.value.pageIndex], queryFn }))
```

Only reads inside the reactive options function become query dependencies.

Source: `examples/vue/with-tanstack-query/src/App.tsx`

### HIGH Mirroring Query data locally

Wrong:

```ts
const rows = ref(query.data.value?.rows ?? [])
```

Correct:

```ts
const rows = computed(() => query.data.value?.rows ?? [])
```

A one-time copy drifts from subsequent cache results.

Source: `examples/vue/with-tanstack-query/src/App.tsx`

### HIGH Omitting server counts

Wrong:

```ts
useTable({ features, columns, data, manualPagination: true })
```

Correct:

```ts
useTable({ features, columns, data, rowCount, manualPagination: true })
```

One returned page cannot tell Table how many pages the server has.

Source: `docs/framework/vue/guide/pagination.md`

## API Discovery

Inspect installed `@tanstack/vue-table/dist/useTable.d.ts`, installed `@tanstack/vue-query/dist/`, and the relevant manual Table feature source for exact option types.

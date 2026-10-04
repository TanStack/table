# Vue Table with TanStack Query

Use this reference when Query owns server data for a Vue table. Read [table state](../../table-state/SKILL.md) for reactive ownership. Run `intent load @tanstack/table-core#table-features` and read its client/server reference before choosing manual processing stages. Query fetches rows already processed by every server-owned stage; manual flags only bypass Table processing.

## Setup

```ts
import { computed, ref } from 'vue'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import {
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'

const features = tableFeatures({ rowPaginationFeature })
const emptyRows: Array<{ name: string }> = []
const pagination = ref({ pageIndex: 0, pageSize: 20 })
const query = useQuery(() => ({
  queryKey: ['people', pagination.value.pageIndex, pagination.value.pageSize],
  queryFn: () =>
    fetch(
      `/api/people?page=${pagination.value.pageIndex}&size=${pagination.value.pageSize}`,
    ).then((r) => r.json()),
  placeholderData: keepPreviousData,
}))
const data = computed(() => query.data.value?.rows ?? emptyRows)
const rowCount = computed(() => query.data.value?.rowCount ?? 0)
const state = computed(() => ({ pagination: pagination.value }))
const table = useTable({
  features,
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

## Core patterns

### Keep query dependencies reactive

Use the Vue Query options function and read refs inside it. Include every manual filter/sort/page input in the query key.

### Pass Query results directly

Expose result fields as computed refs. Introduce a second local data ref only for an explicit editing workflow with a cache-write policy.

## Common mistakes

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
const rows = computed(() => query.data.value?.rows ?? emptyRows)
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

## API discovery

Inspect installed `@tanstack/vue-table/dist/useTable.d.ts`, installed `@tanstack/vue-query/dist/`, and the relevant manual installed Table feature declarations for exact option types.

## Sources

- `TanStack/table:examples/vue/with-tanstack-query`
- `TanStack/table:docs/framework/vue/guide/pagination.md`

# Svelte Table with TanStack Query

Use this reference when Query owns server data for a Svelte table. Read [table state](../../table-state/SKILL.md) for reactive ownership. Run `intent load @tanstack/table-core#table-features` and read its client/server reference before choosing manual processing stages. Query fetches rows already processed by every server-owned stage; manual flags only bypass Table processing.

## Setup

```ts
import { createQuery, keepPreviousData } from '@tanstack/svelte-query'
import {
  createTable,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/svelte-table'

const features = tableFeatures({ rowPaginationFeature })
let pagination = $state({ pageIndex: 0, pageSize: 20 })
const defaultData: Array<{ name: string }> = []
const dataQuery = createQuery<{
  rows: Array<{ name: string }>
  rowCount: number
}>(() => ({
  queryKey: ['people', pagination.pageIndex, pagination.pageSize],
  queryFn: () =>
    fetch(
      `/api/people?page=${pagination.pageIndex}&size=${pagination.pageSize}`,
    ).then((r) => r.json()),
  placeholderData: keepPreviousData,
}))
const table = createTable({
  features,
  columns,
  get data() {
    return dataQuery.data?.rows ?? defaultData
  },
  get rowCount() {
    return dataQuery.data?.rowCount ?? 0
  },
  manualPagination: true,
  state: {
    get pagination() {
      return pagination
    },
  },
  onPaginationChange: (next) => {
    pagination = typeof next === 'function' ? next(pagination) : next
  },
})
```

## Core patterns

### Put every server-owned stage in the query key

If sorting or filtering is manual too, control those slices and include their serializable values in `queryKey`. Return data already processed in that same order.

### Keep Query as server-data owner

Expose `dataQuery.data` through Table getters. Copy it into `$state` only when the application explicitly owns an editable draft and defines cache synchronization.

## Common mistakes

### HIGH Building a non-reactive query

Wrong:

```ts
const query = createQuery({
  queryKey: ['people', pagination.pageIndex],
  queryFn,
})
```

Correct:

```ts
const query = createQuery(() => ({
  queryKey: ['people', pagination.pageIndex],
  queryFn,
}))
```

The options function lets Svelte Query track the rune read and refetch on page changes.

Source: `examples/svelte/with-tanstack-query/src/App.svelte`

### HIGH Expecting manual mode to fetch

Wrong:

```ts
const options = { manualPagination: true }
```

Correct:

```ts
const options = {
  manualPagination: true,
  get data() {
    return dataQuery.data?.rows ?? defaultData
  },
}
```

Manual mode only bypasses Table pagination; Query or application code performs the request. Hoist `defaultData` instead of creating a new `[]` from a repeatedly evaluated getter.

Source: `docs/framework/svelte/guide/pagination.md`

### HIGH Omitting total counts

Wrong:

```ts
const options = { manualPagination: true, data: pageRows }
```

Correct:

```ts
const options = {
  manualPagination: true,
  data: pageRows,
  rowCount: response.rowCount,
}
```

Table cannot derive navigation limits from one server page; provide `rowCount` or `pageCount`.

Source: `docs/framework/svelte/guide/pagination.md`

## API discovery

Inspect `node_modules/@tanstack/svelte-table/dist/index.d.ts` for adapter APIs and installed `@tanstack/svelte-query/dist/` for the exact Query version. Table manual-stage options live in the matching installed core feature declarations.

## Sources

- `TanStack/table:examples/svelte/with-tanstack-query`
- `TanStack/table:docs/framework/svelte/guide/pagination.md`

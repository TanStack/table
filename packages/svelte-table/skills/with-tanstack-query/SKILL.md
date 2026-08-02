---
name: with-tanstack-query
description: >
  Compose Svelte Query with Svelte Table manual filtering, sorting, and pagination using reactive query inputs, query-result data getters, server counts, and a single source of server-data truth.
metadata:
  type: composition
  library: '@tanstack/svelte-table'
  framework: svelte
  library_version: '9.0.0-beta.72'
requires:
  - '@tanstack/table-core#client-vs-server'
  - getting-started
  - table-state
sources:
  - 'TanStack/table:examples/svelte/with-tanstack-query'
  - 'TanStack/table:docs/framework/svelte/guide/pagination.md'
---

This skill builds on `@tanstack/table-core#client-vs-server`, `getting-started`, and `table-state`. Decide which row-processing stages the server owns before composing Query.

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

## Core Patterns

### Put every server-owned stage in the query key

If sorting or filtering is manual too, control those slices and include their serializable values in `queryKey`. Return data already processed in that same order.

### Keep Query as server-data owner

Expose `dataQuery.data` through Table getters. Copy it into `$state` only when the application explicitly owns an editable draft and defines cache synchronization.

## Common Mistakes

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

## API Discovery

Inspect `node_modules/@tanstack/svelte-table/dist/index.d.ts` for adapter APIs and installed `@tanstack/svelte-query/dist/` for the exact Query version. Table manual-stage options live in the matching core feature source.

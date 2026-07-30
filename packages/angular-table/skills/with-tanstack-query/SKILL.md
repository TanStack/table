---
name: with-tanstack-query
description: >
  Compose Angular Query with signal-owned Table filtering, sorting, and pagination state using reactive query options, manual row-model boundaries, direct query data, server counts, and valid injection context.
metadata:
  type: composition
  library: '@tanstack/angular-table'
  framework: angular
  library_version: '9.0.0-beta.62'
requires:
  - '@tanstack/table-core#client-vs-server'
  - getting-started
  - table-state
sources:
  - 'TanStack/table:examples/angular/with-tanstack-query'
  - 'TanStack/table:docs/framework/angular/guide/table-state.md'
  - 'TanStack/table:docs/framework/angular/guide/pagination.md'
---

This skill builds on `@tanstack/table-core#client-vs-server`, `getting-started`, and `table-state`. Decide the server-owned stages and dataset before wiring Query.

## Setup

```ts
import {
  injectQuery,
  keepPreviousData,
} from '@tanstack/angular-query-experimental'
import { signal } from '@angular/core'
import {
  injectTable,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/angular-table'

const features = tableFeatures({ rowPaginationFeature })
const EMPTY_ROWS: never[] = []

export class PeopleTable {
  readonly pagination = signal({ pageIndex: 0, pageSize: 20 })
  readonly query = injectQuery(() => ({
    queryKey: [
      'people',
      this.pagination().pageIndex,
      this.pagination().pageSize,
    ],
    queryFn: () =>
      fetch(
        `/api/people?page=${this.pagination().pageIndex}&size=${this.pagination().pageSize}`,
      ).then((r) => r.json()),
    placeholderData: keepPreviousData,
  }))
  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.query.data()?.rows ?? EMPTY_ROWS,
    rowCount: this.query.data()?.rowCount ?? 0,
    manualPagination: true,
    state: { pagination: this.pagination() },
    onPaginationChange: (next) =>
      typeof next === 'function'
        ? this.pagination.update(next)
        : this.pagination.set(next),
  }))
}
```

## Core Patterns

### Track every server-owned input

Read pagination, sorting, and filtering signals inside `injectQuery(() => ...)` and include them in the query key. Return data already processed for each manual stage.

### Keep Query data authoritative

Read the Query signal directly in `injectTable`. Create another signal only for a deliberate editable draft with an explicit cache synchronization policy.

## Common Mistakes

### HIGH Capturing query inputs outside tracking

Wrong:

```ts
const page = this.pagination().pageIndex
readonly query = injectQuery(() => ({ queryKey: ['people', page], queryFn }))
```

Correct:

```ts
readonly query = injectQuery(() => ({ queryKey: ['people', this.pagination().pageIndex], queryFn }))
```

Signal reads inside the options function establish refetch dependencies.

Source: `examples/angular/with-tanstack-query/src/app/app.ts`

### HIGH Expecting manual mode to request

Wrong:

```ts
injectTable(() => ({ features, columns, data, manualPagination: true }))
```

Correct:

```ts
injectTable(() => ({
  features,
  columns,
  data: this.query.data()?.rows ?? EMPTY_ROWS,
  manualPagination: true,
}))
```

Manual flags only bypass client row processing; Query performs network work.

Source: `examples/angular/with-tanstack-query/src/app/app.ts`

### HIGH Omitting total counts

Wrong:

```ts
{ data: this.query.data()?.rows ?? EMPTY_ROWS, manualPagination: true }
```

Correct:

```ts
{ data: this.query.data()?.rows ?? EMPTY_ROWS, rowCount: this.query.data()?.rowCount ?? 0, manualPagination: true }
```

Table needs `rowCount` or `pageCount` to constrain navigation across server pages.

Source: `docs/framework/angular/guide/pagination.md`

## API Discovery

Inspect installed `@tanstack/angular-table/dist/types/`, the relevant core feature source, and installed Angular Query source for the exact `injectQuery` package/version contract.

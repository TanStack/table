# Angular Table with TanStack Query

Read when Angular Query supplies Table data or owns server-side processing. Load `intent load @tanstack/table-core#table-features` and read its client/server reference to decide which stages the server owns. Read [table-state](../../table-state/SKILL.md) for the signal or atom wiring used by the query key.

This reference inherits the version of its owning skill.

## Setup

```ts
import {
  injectQuery,
  keepPreviousData,
} from '@tanstack/angular-query-experimental'
import { Component, signal } from '@angular/core'
import {
  injectTable,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/angular-table'

type Person = { id: string; name: string }
type PersonPage = { rows: Person[]; rowCount: number }
const features = tableFeatures({ rowPaginationFeature })
const columns = [{ accessorKey: 'name' }]
const EMPTY_ROWS: Person[] = []

@Component({
  selector: 'people-table',
  template: `{{ table.getRowModel().rows.length }} rows`,
})
export class PeopleTable {
  readonly pagination = signal({ pageIndex: 0, pageSize: 20 })
  readonly query = injectQuery(() => ({
    queryKey: [
      'people',
      this.pagination().pageIndex,
      this.pagination().pageSize,
    ],
    queryFn: (): Promise<PersonPage> =>
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

Provide Angular Query's QueryClient in the application injection context before constructing this component. The server response contains the requested `rows` and total `rowCount`.

## Core patterns

### Track every server-owned input

Read pagination, sorting, and filtering signals inside `injectQuery(() => ...)` and include them in the query key. Return data already processed for each manual stage.

### Keep Query data authoritative

Read the Query signal directly in `injectTable`. Create another signal only for a deliberate editable draft with an explicit cache synchronization policy.

## Common mistakes

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

## API discovery

Inspect installed `@tanstack/angular-table/dist/types/`, the relevant core feature declarations, and installed Angular Query declarations for the exact `injectQuery` package/version contract.

## Sources

- `TanStack/table:examples/angular/with-tanstack-query`
- `TanStack/table:docs/framework/angular/guide/table-state.md`
- `TanStack/table:docs/framework/angular/guide/pagination.md`

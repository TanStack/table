---
name: angular/getting-started
description: >
  End-to-end first-table journey for TanStack Table v9 in Angular: install
  `@tanstack/angular-table`, declare `features` with `tableFeatures()` (row-model factories and
  fn registries live on the features object), build columns with the `TFeatures, TData` generic
  order, call `injectTable(() => ({...}))` from an injection context, and render with `FlexRender` /
  `*flexRenderHeader` / `*flexRenderCell` / `*flexRenderFooter`. Covers the minimum-viable
  signal-backed table plus the upgrade path to sorting + filtering + pagination.
type: lifecycle
library: tanstack-table
framework: angular
library_version: '9.0.0-alpha.48'
requires:
  - angular/table-state
  - angular/angular-rendering-directives
  - setup
  - column-definitions
sources:
  - TanStack/table:docs/framework/angular/angular-table.md
  - TanStack/table:docs/framework/angular/guide/table-state.md
  - TanStack/table:docs/framework/angular/guide/rendering.md
  - TanStack/table:packages/angular-table/src/injectTable.ts
  - TanStack/table:examples/angular/basic-inject-table/
  - TanStack/table:examples/angular/basic-app-table/
---

# Getting Started — Angular Table v9

> Goal: from zero to a working signal-backed, sorted + paginated, type-safe
> table in Angular ≥19.
>
> v9 is **explicit**: tell the table which features you want with `features`.
> Row-model factories and fn registries live on the features object alongside
> the feature flags. That explicitness is what makes the v9 bundle tree-shakeable.

---

## 1. Install

```bash
pnpm add @tanstack/angular-table
# or npm / yarn / bun
```

Requires Angular ≥19 (signal APIs, `input()`, structural directive metadata).
Standalone components are assumed.

---

## 2. The simplest possible table (core only)

```ts
// app.ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  FlexRender,
  injectTable,
  tableFeatures,
  type ColumnDef,
} from '@tanstack/angular-table'

type Person = {
  id: string
  firstName: string
  lastName: string
  age: number
}

// 1. features OUTSIDE the component class (stable reference)
const features = tableFeatures({}) // empty = core row model only

// 2. columns OUTSIDE the component class (stable reference)
const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorKey: 'firstName',
    header: 'First name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'lastName',
    header: 'Last name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    cell: (info) => info.getValue(),
  },
]

@Component({
  selector: 'app-root',
  imports: [FlexRender], // tuple imports BOTH directives
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly data = signal<Array<Person>>([
    { id: '1', firstName: 'Ada', lastName: 'Lovelace', age: 36 },
    { id: '2', firstName: 'Alan', lastName: 'Turing', age: 41 },
  ])

  // 3. injectTable in an injection context (a class field qualifies)
  readonly table = injectTable(() => ({
    features, // required in v9; core row model is automatic
    columns, // stable ref
    data: this.data(), // signal read → re-syncs the table on change
  }))
}
```

```html
<!-- app.html -->
<table>
  <thead>
    @for (headerGroup of table.getHeaderGroups(); track headerGroup.id) {
    <tr>
      @for (header of headerGroup.headers; track header.id) {
      <th>
        @if (!header.isPlaceholder) {
        <ng-container *flexRenderHeader="header; let value">
          {{ value }}
        </ng-container>
        }
      </th>
      }
    </tr>
    }
  </thead>

  <tbody>
    @for (row of table.getRowModel().rows; track row.id) {
    <tr>
      @for (cell of row.getVisibleCells(); track cell.id) {
      <td>
        <ng-container *flexRenderCell="cell; let value">
          {{ value }}
        </ng-container>
      </td>
      }
    </tr>
    }
  </tbody>
</table>
```

That's a complete v9 table. No sorting, no pagination — just `<table>` markup
driven by the row model.

### What the boilerplate is doing

- `tableFeatures({})` registers no opt-in features. The core row model
  (`getRowModel()`) is always available. With `features: tableFeatures({})`,
  `table.atoms.*` only contains the slices core ships with — no `pagination`,
  no `sorting`, no `rowSelection` until you add the matching features.
- `injectTable(() => ({...}))` runs the initializer, builds the table, and
  re-runs the initializer whenever any signal read inside changes. Stable
  references outside the initializer keep `columns` / `features`
  from getting recreated on every data update.

---

## 3. Add a feature — sorting

Each opt-in feature has two pieces in v9:

1. The **feature** itself (`rowSortingFeature`) in `features` — adds APIs
   like `column.toggleSorting()` and the `sorting` state slice.
2. The **row-model factory** (`createSortedRowModel()`) on the features object
   — produces the sorted output. Without it, `table.getRowModel().rows` is
   unsorted regardless of sort state.

```ts
import {
  injectTable,
  tableFeatures,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
  type ColumnDef,
} from '@tanstack/angular-table'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(), // <-- enables sorting output
  sortFns,
})

readonly table = injectTable(() => ({
  features,
  columns,
  data: this.data(),
}))
```

In the template, drive sorting from the header:

```html
@if (!header.isPlaceholder) {
<th
  (click)="header.column.toggleSorting()"
  [style.cursor]="header.column.getCanSort() ? 'pointer' : ''"
>
  <ng-container *flexRenderHeader="header; let value">{{ value }}</ng-container>
  @switch (header.column.getIsSorted()) { @case ('asc') { ▲ } @case ('desc') { ▼
  } }
</th>
}
```

> **Use `column.toggleSorting()`, not your own sort handler.** It correctly
> handles the asc → desc → unsorted cycle. Same applies for every other
> feature.

`sortFns` is the registry of built-in sort functions
(`alphanumeric`, `basic`, `datetime`, etc.). Pass only the ones you use to
tree-shake (`sortFns: { basic: sortFns.basic }`), or pass `sortFns`
in its entirety for all of them.

---

## 4. Add filtering + pagination

```ts
import {
  injectTable,
  tableFeatures,
  rowSortingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  createSortedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  sortFns,
  filterFns,
  type ColumnDef,
} from '@tanstack/angular-table'

const features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
  filterFns,
})

readonly table = injectTable(() => ({
  features,
  columns,
  data: this.data(),
  initialState: {
    pagination: { pageIndex: 0, pageSize: 10 },
  },
}))
```

Pagination controls — again, prefer the table APIs:

```html
<button (click)="table.previousPage()" [disabled]="!table.getCanPreviousPage()">
  ‹
</button>
<span>
  Page {{ table.atoms.pagination.get().pageIndex + 1 }} of {{
  table.getPageCount() }}
</span>
<button (click)="table.nextPage()" [disabled]="!table.getCanNextPage()">
  ›
</button>

<select
  [value]="table.atoms.pagination.get().pageSize"
  (change)="table.setPageSize(Number($any($event.target).value))"
>
  @for (size of [10, 20, 50]; track size) {
  <option [value]="size">{{ size }}</option>
  }
</select>
```

Reading state in the template via `table.atoms.<slice>.get()` is signal-backed
— Angular tracks it and re-renders on change.

---

## 5. Use the column helper for safer types

`createColumnHelper<TFeatures, TData>()` (generic order: features first!) gives
type-safe accessor / display / group definitions, plus a `columns(...)` method
for better inference across heterogeneous columns:

```ts
import { createColumnHelper } from '@tanstack/angular-table'

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: 'fullName',
    header: 'Full name',
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => `Edit #${row.original.id}`,
  }),
])
```

> v9 changed the generic order: `createColumnHelper<typeof features, Person>()`,
> **not** `createColumnHelper<Person>()`. Same for `ColumnDef<typeof features, Person>`.

If multiple components share the same `features` object, factor them into a
`createTableHook(...)` call — see
`tanstack-table/angular/angular-rendering-directives` §10 and the
`composable-tables` example.

---

## 6. Stable row identity — set `getRowId`

If your rows have a primary key, set `getRowId`. This makes row selection,
row pinning, and refetch-based updates correct.

```ts
readonly table = injectTable(() => ({
  features,
  columns,
  data: this.data(),
  getRowId: (row) => row.id, // ← stable ID across re-fetches
}))
```

Without `getRowId`, the row index becomes the ID — selection state
("rows 0–4 selected") survives sorting but breaks across server refetches that
return rows in a new order.

---

## 7. State ownership — start with internal, hoist when you need to

The simplest table lets TanStack Table own all state internally. You set
starting values with `initialState`, and you use APIs like `table.nextPage()`
and `table.setSorting(...)` to drive updates.

```ts
readonly table = injectTable(() => ({
  features,
  columns,
  data: this.data(),
  initialState: {
    pagination: { pageIndex: 0, pageSize: 25 },
    sorting: [{ id: 'age', desc: true }],
  },
}))
```

Hoist a slice into an Angular signal only when something outside the table
needs to read or react to it (URL sync, debounced server fetch, persistence,
cross-component coordination). The pattern is `state` + `on[State]Change` →
see `tanstack-table/angular/table-state` §6.

For full server-driven tables, see `tanstack-table/angular/client-to-server`.

---

## Failure modes

### 1. (CRITICAL) Calling `injectTable` outside an injection context

`injectTable` calls `assertInInjectionContext`. It must be invoked from a
class-field initializer, constructor, or factory inside a DI scope. Calling it
from a service method or a `setTimeout` callback throws:

> `NG0203: inject() must be called from an injection context...`

If you need to construct a table from a service method, capture the injector
and use `runInInjectionContext(injector, () => injectTable(...))`.

### 2. (CRITICAL) Hallucinating v8 `createAngularTable` or `getCoreRowModel()`

```ts
// ❌ v8
import { createAngularTable, getCoreRowModel } from '@tanstack/angular-table'

// ✅ v9
import { injectTable, tableFeatures } from '@tanstack/angular-table'
```

There is no `getCoreRowModel()` / `getSortedRowModel()` / `getFilteredRowModel()`
in v9. Core row model is automatic; the rest are
`createSortedRowModel()` / `createFilteredRowModel()` / etc.
registered as slots on the `features` object alongside `sortFns` / `filterFns`.

### 3. (CRITICAL) Reimplementing what the table API already does

Telltale AI signs in a getting-started snippet:

- Custom `sortBy()` on the data signal instead of `table.setSorting()` /
  `column.toggleSorting()`.
- Manual `pageIndex` math instead of `table.nextPage()` / `table.getCanNextPage()`.
- Computing `getCanNextPage()` as `pageIndex < Math.ceil(rows / pageSize) - 1`
  instead of asking the table.
- Manual filtering of the data array before passing it to the table when you
  could just register `columnFilteringFeature` + `createFilteredRowModel`.

The table already does all of this. Use it.

### 4. (HIGH) Feature without its row model (or vice versa)

```ts
// ❌ rowSortingFeature without sortedRowModel → sort state changes, rows don't reorder
const features = tableFeatures({ rowSortingFeature })

// ✅ factory and fn registry on the features object
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
```

Full mapping table → [`references/feature-row-model-mapping.md`](references/feature-row-model-mapping.md).

### 5. (HIGH) Declaring `columns` / `features` inside the initializer

```ts
// ❌ Recreated on every signal change
readonly table = injectTable(() => ({
  features: tableFeatures({ rowSortingFeature, sortedRowModel: createSortedRowModel(), sortFns }),
  columns: [/* … */],
  data: this.data(),
}))

// ✅ Stable references outside, signal reads inside
const features = tableFeatures({ rowSortingFeature, sortedRowModel: createSortedRowModel(), sortFns })
const columns: Array<ColumnDef<typeof features, Person>> = [/* … */]

readonly table = injectTable(() => ({
  features,
  columns,
  data: this.data(),
}))
```

### 6. (HIGH) Importing a non-existent `flexRender` function

In Angular, `FlexRender` is a directive tuple, not a function. There is no
`flexRender(fn, ctx)` call expression — that's the React/Vue API. Always:

```ts
import { FlexRender } from '@tanstack/angular-table'
@Component({ imports: [FlexRender] })
```

and use `*flexRenderCell` / `*flexRenderHeader` / `*flexRenderFooter` in the
template.

Lower-severity failure modes (MEDIUM: `createColumnHelper` generic-order flip,
importing only `FlexRenderDirective` without the shorthand) →
[`references/feature-row-model-mapping.md`](references/feature-row-model-mapping.md#lower-severity-failure-modes-medium).

---

## References

- [Feature → row-model mapping table and MEDIUM failure modes](references/feature-row-model-mapping.md)

---

## See also

- `tanstack-table/angular/table-state` — state model, ownership, controlled vs internal
- `tanstack-table/angular/angular-rendering-directives` — full rendering API surface
- `tanstack-table/angular/migrate-v8-to-v9` — for projects upgrading from v8
- `tanstack-table/angular/client-to-server` — flipping a working table to a server endpoint
- `tanstack-table/angular/production-readiness` — tree-shaking, stable refs, selectors
- Example: `examples/angular/basic-inject-table/`
- Example: `examples/angular/basic-app-table/` (uses `createTableHook`)

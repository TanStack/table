---
title: Lit Table
---

The `@tanstack/lit-table` adapter wraps `@tanstack/table-core` with a Lit `ReactiveController`, rendering helpers, and types. `TableController` installs the Lit `coreReativityFeature` for you, so TanStack Store atom changes can request Lit host updates.

TanStack Table v9 is explicit about what a table uses. Register features with `_features`, and register client-side row model factories with `_rowModels`. The core row model is included by default, so a basic table can use `_rowModels: {}`.

## Creating a Table

Create one `TableController` for the Lit host, then call `tableController.table(...)` during render.

```ts
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import {
  TableController,
  tableFeatures,
  type ColumnDef,
} from '@tanstack/lit-table'

type Person = {
  firstName: string
  lastName: string
  age: number
}

const _features = tableFeatures({})

const columns: Array<ColumnDef<typeof _features, Person>> = [
  {
    accessorKey: 'firstName',
    header: 'First name',
    cell: (info) => info.getValue(),
  },
]

@customElement('people-table')
export class PeopleTable extends LitElement {
  private tableController = new TableController<typeof _features, Person>(this)

  @state()
  private data: Person[] = []

  protected render() {
    const table = this.tableController.table({
      _features,
      _rowModels: {},
      columns,
      data: this.data,
    })

    return html`...`
  }
}
```

For feature-specific row models, register the feature and put the row model factory under `_rowModels`.

```ts
import {
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/lit-table'

const _features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
})

const tableOptions = {
  _features,
  _rowModels: {
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(sortFns),
  },
}
```

## Table State

Table state is managed with TanStack Store atoms in v9. For most tables, you do not need to manage table state yourself: set `initialState` when you need starting values, and use feature APIs like `table.nextPage()`, `table.setSorting(...)`, and `row.toggleSelected()` instead of mutating state directly.

Use `atoms` when your app should own one state slice with TanStack Store. Lit `@state()` values can also be passed through `state` with the matching `on[State]Change` option for simple integrations. Selected table state is available on `table.state` when you pass a selector to `tableController.table(...)`.

```ts
import { createAtom } from '@tanstack/store'
import {
  TableController,
  rowPaginationFeature,
  tableFeatures,
  type PaginationState,
} from '@tanstack/lit-table'

const _features = tableFeatures({
  rowPaginationFeature,
})

const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const table = this.tableController.table({
  _features,
  _rowModels: {},
  columns,
  data: this.data,
  atoms: {
    pagination: paginationAtom,
  },
})
```

See the [Table State Guide](./guide/table-state.md) for selectors, external atoms, and state ownership patterns.

## Rendering Headers, Cells, and Footers

Use `table.FlexRender` to render column `header`, `cell`, and `footer` definitions. It handles plain values and Lit templates.

```ts
return html`
  <tbody>
    ${table.getRowModel().rows.map(
      (row) => html`
        <tr>
          ${row.getVisibleCells().map(
            (cell) => html`<td>${table.FlexRender({ cell })}</td>`,
          )}
        </tr>
      `,
    )}
  </tbody>
`
```

## createTableHook

`createTableHook` creates app-specific Lit table helpers. Use it when multiple tables should share `_features`, `_rowModels`, default options, column helpers, and component conventions.

```ts
import { createTableHook, tableFeatures } from '@tanstack/lit-table'

const { useAppTable, createAppColumnHelper } = createTableHook({
  _features: tableFeatures({}),
  _rowModels: {},
})

const columnHelper = createAppColumnHelper<Person>()

const table = useAppTable(this, {
  columns,
  data: this.data,
})
```

See the [Composable Tables example](./examples/composable-tables) for the full pattern.

## API Reference

See the [Lit API Reference](./reference/index.md).

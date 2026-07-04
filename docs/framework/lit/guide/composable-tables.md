---
title: Composable Tables (createTableHook) Guide
---

`createTableHook` creates an app-specific table factory. Use it to define shared features, row models, and default table options once, then create each Lit table with the columns and data that are unique to that table.

The same API can also register reusable table, cell, and header render helpers, but component registration is optional. Start with shared options and features first; add reusable render helpers only when your app needs standardized table UI pieces.

## Examples

- [Basic App Table](../examples/basic-app-table) - Minimal `createTableHook` setup.
- [Composable Tables](../examples/composable-tables) - Richer Users and Products tables sharing `src/hooks/table.ts` and reusable render helpers.

## Start With Shared Features and Options

Create one app table hook and put the feature set, row models, and shared defaults there. This example makes sorting available to every table created by `useAppTable`.

```ts
import {
  createSortedRowModel,
  createTableHook,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/lit-table'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const { useAppTable, createAppColumnHelper } = createTableHook({
  features,
  debugTable: true,
  enableSortingRemoval: false,
})
```

Options passed to `createTableHook` become defaults for every table created by `useAppTable`. The `features` option is also bound to the returned column helper, so column definitions know that sorting APIs are available.

## Create App Columns

Create one column helper per row type. The helper is already bound to your app's feature set, so each table does not need to thread `typeof features` through its column definitions.

```ts
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
}

const columnHelper = createAppColumnHelper<Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: 'Last Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('age', {
    header: 'Age',
  }),
  columnHelper.accessor('visits', {
    header: 'Visits',
  }),
])
```

## Create A Table

Create each table with `useAppTable`. The call site provides table-specific inputs such as `columns` and `data`; shared features and defaults come from the hook.

```ts
private appTable = (() => {
  const host = this
  return useAppTable(
    this,
    {
      columns,
      get data() {
        return host.data
      },
    },
    (state) => ({ sorting: state.sorting }),
  )
})()
```

## Render With The Normal Table APIs

You can render the table with the same table instance APIs used by a standalone `TableController` table. This simple path does not require `AppCell`, `AppHeader`, `AppFooter`, or registered render helpers.

```ts
const table = this.appTable.table()

return html`
  <table>
    <thead>
      ${table.getHeaderGroups().map(
        (headerGroup) => html`
          <tr>
            ${headerGroup.headers.map(
              (header) => html`
                <th @click=${header.column.getToggleSortingHandler()}>
                  ${header.isPlaceholder ? null : FlexRender({ header })}
                </th>
              `,
            )}
          </tr>
        `,
      )}
    </thead>
    <tbody>
      ${table.getRowModel().rows.map(
        (row) => html`
          <tr>
            ${row
              .getAllCells()
              .map((cell) => html`<td>${FlexRender({ cell })}</td>`)}
          </tr>
        `,
      )}
    </tbody>
  </table>
`
```

## Override Shared Defaults Per Table

Options passed to `useAppTable` override defaults from `createTableHook`. Use this for the few tables that need different behavior without creating a separate app hook.

```ts
const host = this

const table = useAppTable(this, {
  columns,
  get data() {
    return host.data
  },
  enableSortingRemoval: true,
})
```

## Optional: Reusable Components

The richer composable-tables example also uses `createTableHook` as a component registry. Use this when several tables should share the same toolbar controls, cell renderers, header renderers, or footer renderers.

### Component Registry Setup

The composable tables example keeps the shared configuration in `src/hooks/table.ts`.

```ts
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  filterFns,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/lit-table'

import {
  CategoryCell,
  NumberCell,
  PriceCell,
  ProgressCell,
  RowActionsCell,
  StatusCell,
  TextCell,
} from '../components/cell-components'
import {
  ColumnFilter,
  FooterColumnId,
  FooterSum,
  SortIndicator,
} from '../components/header-components'

export const features = tableFeatures({
  columnFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
  filterFns,
})

export const { createAppColumnHelper, useAppTable, useTableContext } =
  createTableHook({
    features,
    getRowId: (row) => row.id,
    cellComponents: {
      TextCell,
      NumberCell,
      StatusCell,
      ProgressCell,
      RowActionsCell,
      PriceCell,
      CategoryCell,
    },
    headerComponents: {
      SortIndicator,
      ColumnFilter,
      FooterColumnId,
      FooterSum,
    },
  })
```

The Lit example does not register `tableComponents` in `createTableHook`. Its table-level controls are custom elements that call `useTableContext(this)`, so they consume table context directly.

### Returned Helpers

| Helper                  | Purpose                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| `useAppTable`           | Creates a `TableController`-backed app table for a Lit host and attaches app render helpers.      |
| `createAppColumnHelper` | Creates column helpers with `TFeatures` and registered cell/header component types already bound. |
| `useTableContext`       | Lets custom elements like `pagination-controls` read the nearest app table context.               |

### Component Columns

Create one column helper per row type. Cell/header components in Lit are functions, so column definitions call the registered function on the enhanced `cell` or `header`.

```ts
const personColumnHelper = createAppColumnHelper<Person>()

const columns = personColumnHelper.columns([
  personColumnHelper.accessor('firstName', {
    header: 'First Name',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.TextCell(),
  }),
  personColumnHelper.accessor('age', {
    header: 'Age',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.NumberCell(),
  }),
  personColumnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ cell }) => cell.RowActionsCell(),
  }),
])
```

### Component Table Rendering

Call `useAppTable(this, options, selector)` from the `LitElement` host. The helper returns an object with `table()`, which computes the current app table through the controller.

```ts
private appTable = (() => {
  const host = this
  return useAppTable(
    this,
    {
      columns,
      get data() {
        return host.data
      },
      debugTable: true,
    },
    (state) => ({
      pagination: state.pagination,
      sorting: state.sorting,
      columnFilters: state.columnFilters,
    }),
  )
})()
```

Inside `render()`, use callback-based app wrappers:

```ts
const table = this.appTable.table()

return html`
  <table-toolbar .title=${'Users Table'}></table-toolbar>

  <table>
    <thead>
      ${table.getHeaderGroups().map(
        (headerGroup) => html`
          <tr>
            ${headerGroup.headers.map((h) =>
              table.AppHeader(
                h,
                (header) => html`
                  <th @click=${header.column.getToggleSortingHandler()}>
                    ${header.FlexRender()} ${header.SortIndicator()}
                    ${header.ColumnFilter()}
                  </th>
                `,
              ),
            )}
          </tr>
        `,
      )}
    </thead>
    <tbody>
      ${table.getRowModel().rows.map(
        (row) => html`
          <tr>
            ${row
              .getAllCells()
              .map((cell) =>
                table.AppCell(
                  cell,
                  (appCell) => html`<td>${appCell.FlexRender()}</td>`,
                ),
              )}
          </tr>
        `,
      )}
    </tbody>
  </table>

  <pagination-controls></pagination-controls>
  <row-count></row-count>
`
```

### Reusing The Component Registry

The Users and Products table elements import the same `createAppColumnHelper` and `useAppTable` from `src/hooks/table.ts`. Their data and columns differ, but sorting, filtering, pagination, row IDs, and registered cell/header renderers come from one shared configuration.

## When To Use This Pattern

Use `createTableHook` when multiple tables should share features, row models, default options, or conventions. Use the standalone `TableController` API for a one-off table. Add the component registry only when the app wants standardized reusable table UI pieces.

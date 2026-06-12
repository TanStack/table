---
title: Composable Tables Guide
---

Composable tables are app-level table factories built with `createTableHook`. They let Lit apps define shared features, row models, default options, and reusable render helpers once, then create multiple tables from that setup.

Use this pattern when several tables should share behavior and cell/header rendering conventions. For one standalone Lit table, `TableController` is usually enough.

## Examples

- [Composable Tables](../examples/composable-tables) - Users and Products tables sharing `src/hooks/table.ts`.
- [Basic App Table](../examples/basic-app-table) - Minimal `createTableHook` setup.

## Setup

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

## Returned Helpers

| Helper | Purpose |
|---|---|
| `useAppTable` | Creates a `TableController`-backed app table for a Lit host and attaches app render helpers. |
| `createAppColumnHelper` | Creates column helpers with `TFeatures` and registered cell/header component types already bound. |
| `useTableContext` | Lets custom elements like `pagination-controls` read the nearest app table context. |

## Columns

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

## Table Rendering

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
                table.AppCell(cell, (appCell) => html`<td>${appCell.FlexRender()}</td>`),
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

## Reusing The Hook

The Users and Products table elements import the same `createAppColumnHelper` and `useAppTable` from `src/hooks/table.ts`. Their data and columns differ, but sorting, filtering, pagination, row IDs, and registered cell/header renderers come from one shared configuration.

---
title: Composable Tables Guide
---

Composable tables are app-level table factories built with `createTableHook`. They let Solid apps define shared features, row models, default options, and reusable JSX components once, then create multiple tables from that shared setup.

Use this pattern when several tables should share behavior and rendering conventions. For one standalone table, `createTable` is usually enough.

## Examples

- [Composable Tables](../examples/composable-tables) - Users and Products tables sharing `src/hooks/table.ts`.
- [Basic App Table](../examples/basic-app-table) - Minimal `createTableHook` setup.

## Setup

The composable tables example keeps the shared configuration in `src/hooks/table.ts`.

```tsx
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
} from '@tanstack/solid-table'

import {
  PaginationControls,
  RowCount,
  TableToolbar,
} from '../components/table-components'
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

const features = tableFeatures({
  columnFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
  filterFns,
})

export const {
  createAppColumnHelper,
  createAppTable,
  useTableContext,
  useCellContext,
  useHeaderContext,
} = createTableHook({
  features,
  getRowId: (row) => row.id,
  tableComponents: {
    PaginationControls,
    RowCount,
    TableToolbar,
  },
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

## Returned Helpers

| Helper | Purpose |
|---|---|
| `createAppTable` | Creates a Solid table with shared features, row models, defaults, and registered components. |
| `createAppColumnHelper` | Creates column helpers with `TFeatures` and registered component types already bound. |
| `useTableContext` | Reads the current table inside registered table components. |
| `useCellContext` | Reads the current cell inside registered cell components. |
| `useHeaderContext` | Reads the current header/footer inside registered header components. |

## Columns

Create one column helper per row type. Since the helper is bound to the app setup, registered JSX components are available on cell and header contexts.

```tsx
const personColumnHelper = createAppColumnHelper<Person>()

const columns = personColumnHelper.columns([
  personColumnHelper.accessor('firstName', {
    header: 'First Name',
    footer: (props) => props.column.id,
    cell: ({ cell }) => <cell.TextCell />,
  }),
  personColumnHelper.accessor('age', {
    header: 'Age',
    footer: (props) => props.column.id,
    cell: ({ cell }) => <cell.NumberCell />,
  }),
  personColumnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ cell }) => <cell.RowActionsCell />,
  }),
])
```

## Table Rendering

Create each table with `createAppTable`. You provide table-specific options like `key`, `columns`, and reactive data; the shared table infrastructure comes from the hook.

```tsx
const [data, setData] = createSignal(makeData(1_000))

const table = createAppTable({
  key: 'users-table',
  columns,
  get data() {
    return data()
  },
  debugTable: true,
})
```

The returned table includes JSX wrappers. The example uses `table.AppTable` with a selector to subscribe to the state slices used by the table UI.

```tsx
<table.AppTable
  selector={(state) => ({
    pagination: state.pagination,
    sorting: state.sorting,
    columnFilters: state.columnFilters,
  })}
>
  {(state) => {
    const sorting = () => state().sorting

    return (
      <div class="table-container">
        <table.TableToolbar title="Users Table" onRefresh={refreshData} />

        <table>
          <thead>
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <tr>
                  <For each={headerGroup.headers}>
                    {(h) => (
                      <table.AppHeader header={h}>
                        {(header) => (
                          <th onClick={header.column.getToggleSortingHandler()}>
                            <header.FlexRender />
                            <header.SortIndicator />
                            <header.ColumnFilter />
                          </th>
                        )}
                      </table.AppHeader>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </thead>
          <tbody>
            <For each={table.getRowModel().rows}>
              {(row) => (
                <tr>
                  <For each={row.getAllCells()}>
                    {(c) => (
                      <table.AppCell cell={c}>
                        {(cell) => (
                          <td>
                            <cell.FlexRender />
                          </td>
                        )}
                      </table.AppCell>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>

        <table.PaginationControls />
        <table.RowCount />
      </div>
    )
  }}
</table.AppTable>
```

## Reusing The Hook

The example creates `personColumnHelper` and `productColumnHelper` from the same `createAppColumnHelper`, then creates both Users and Products tables with `createAppTable`. Each table keeps its own signals and columns, while the shared hook owns features, row models, row IDs, and component conventions.

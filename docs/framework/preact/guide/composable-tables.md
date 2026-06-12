---
title: Composable Tables Guide
---

Composable tables are app-level table factories built with `createTableHook`. They let Preact apps define shared features, row models, default options, and reusable components once, then create multiple tables from that shared setup.

Use this pattern when several tables should share behavior and rendering conventions. For one standalone table, `useTable` is usually enough.

## Examples

- [Composable Tables](../examples/composable-tables) - Users and Products tables sharing `src/hooks/table.ts`.
- [Basic useAppTable](../examples/basic-use-app-table) - Minimal `createTableHook` setup.

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
} from '@tanstack/preact-table'

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
  useAppTable,
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
| `useAppTable` | Creates a table with shared features, row models, defaults, and registered components. |
| `createAppColumnHelper` | Creates column helpers with `TFeatures` and registered component types already bound. |
| `useTableContext` | Reads the current table inside registered table components. |
| `useCellContext` | Reads the current cell inside registered cell components. |
| `useHeaderContext` | Reads the current header/footer inside registered header components. |

## Columns

Create one column helper per row type. The helper is bound to the app table setup, so column definitions can reference registered components directly.

```tsx
const personColumnHelper = createAppColumnHelper<Person>()

const columns = useMemo(
  () =>
    personColumnHelper.columns([
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
    ]),
  [],
)
```

Registered cell components use `useCellContext()` internally, and registered header/footer components use `useHeaderContext()`.

## Table Rendering

Create each table with `useAppTable`. You pass table-specific options like `key`, `columns`, and `data`; the shared `features` (which includes row model factories), `getRowId`, and component registries come from the hook.

```tsx
const table = useAppTable(
  {
    key: 'users-table',
    columns,
    data,
    debugTable: true,
  },
  (state) => state,
)
```

The returned table includes `AppTable`, `AppHeader`, `AppCell`, and `AppFooter` wrappers. The example uses `AppTable` with a selector so rendering can subscribe to the state slices used by that table.

```tsx
<table.AppTable
  selector={(state) => ({
    pagination: state.pagination,
    sorting: state.sorting,
    columnFilters: state.columnFilters,
  })}
>
  {({ sorting, columnFilters }) => (
    <div className="table-container">
      <table.TableToolbar title="Users Table" onRefresh={refreshData} />

      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((h) => (
                <table.AppHeader header={h} key={h.id}>
                  {(header) => (
                    <th onClick={header.column.getToggleSortingHandler()}>
                      <header.FlexRender />
                      <header.SortIndicator />
                      <header.ColumnFilter />
                    </th>
                  )}
                </table.AppHeader>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getAllCells().map((c) => (
                <table.AppCell cell={c} key={c.id}>
                  {(cell) => (
                    <td>
                      <cell.FlexRender />
                    </td>
                  )}
                </table.AppCell>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <table.PaginationControls />
      <table.RowCount />
    </div>
  )}
</table.AppTable>
```

## Reusing The Hook

The example creates both `personColumnHelper` and `productColumnHelper` from the same `createAppColumnHelper`, then renders Users and Products tables with the same `useAppTable` factory. Each table owns its data and columns, while the app hook owns table infrastructure and component conventions.

---
title: Composable Tables (createTableHook) Guide
---

`createTableHook` creates an app-specific table factory. Use it to define shared features, row models, and default table options once, then create each Preact table with the columns and data that are unique to that table.

The same API can also register reusable table, cell, and header components, but component registration is optional. Start with shared options and features first; add reusable components only when your app needs standardized table UI pieces.

## Examples

- [Basic useAppTable](../examples/basic-use-app-table) - Minimal `createTableHook` setup.
- [Composable Tables](../examples/composable-tables) - Richer Users and Products tables sharing `src/hooks/table.ts` and reusable components.

## Start With Shared Features and Options

Create one app table hook and put the feature set, row models, and shared defaults there. This example makes sorting available to every table created by `useAppTable`.

```tsx
import {
  createSortedRowModel,
  createTableHook,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/preact-table'

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

```tsx
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
    header: () => <span>Last Name</span>,
    cell: (info) => <i>{info.getValue()}</i>,
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

```tsx
function UsersTable({ data }: { data: Person[] }) {
  const table = useAppTable(
    {
      key: 'users-table',
      columns,
      data,
    },
    (state) => ({ sorting: state.sorting }),
  )

  // render with the table instance
}
```

## Render With The Normal Table APIs

You can render the table with the same table instance APIs used by a standalone `useTable` table. This simple path does not require `AppTable`, `AppCell`, `AppHeader`, or registered components.

```tsx
return (
  <table>
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              onClick={header.column.getToggleSortingHandler()}
            >
              {header.isPlaceholder ? null : (
                <table.FlexRender header={header} />
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id}>
          {row.getAllCells().map((cell) => (
            <td key={cell.id}>
              <table.FlexRender cell={cell} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)
```

## Override Shared Defaults Per Table

Options passed to `useAppTable` override defaults from `createTableHook`. Use this for the few tables that need different behavior without creating a separate app hook.

```tsx
const table = useAppTable(
  {
    key: 'sortable-users-table',
    columns,
    data,
    enableSortingRemoval: true,
  },
  (state) => ({ sorting: state.sorting }),
)
```

## Optional: Reusable Components

The richer composable-tables example also uses `createTableHook` as a component registry. Use this when several tables should share the same toolbar controls, cell renderers, header renderers, or footer renderers.

### Component Registry Setup

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

### Returned Helpers

| Helper | Purpose |
|---|---|
| `useAppTable` | Creates a table with shared features, row models, defaults, and registered components. |
| `createAppColumnHelper` | Creates column helpers with `TFeatures` and registered component types already bound. |
| `useTableContext` | Reads the current table inside registered table components. |
| `useCellContext` | Reads the current cell inside registered cell components. |
| `useHeaderContext` | Reads the current header/footer inside registered header components. |

### Component Columns

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

### Component Table Rendering

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

### Reusing The Component Registry

The example creates both `personColumnHelper` and `productColumnHelper` from the same `createAppColumnHelper`, then renders Users and Products tables with the same `useAppTable` factory. Each table owns its data and columns, while the app hook owns table infrastructure and component conventions.

## When To Use This Pattern

Use `createTableHook` when multiple tables should share features, row models, default options, or conventions. Use the standalone `useTable` API for a one-off table. Add the component registry only when the app wants standardized reusable table UI pieces.

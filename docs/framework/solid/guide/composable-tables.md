---
title: Composable Tables (createTableHook) Guide
---

`createTableHook` creates an app-specific table factory. Use it to define shared features, row models, and default table options once, then create each Solid table with the columns and data that are unique to that table.

The same API can also register reusable table, cell, and header components, but component registration is optional. Start with shared options and features first; add reusable components only when your app needs standardized table UI pieces.

## Examples

- [Basic App Table](../examples/basic-app-table) - Minimal `createTableHook` setup.
- [Composable Tables](../examples/composable-tables) - Richer Users and Products tables sharing `src/hooks/table.ts` and reusable components.

## Start With Shared Features and Options

Create one app table hook and put the feature set, row models, and shared defaults there. This example makes sorting available to every table created by `createAppTable`.

```tsx
import {
  createSortedRowModel,
  createTableHook,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/solid-table'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const { createAppTable, createAppColumnHelper } = createTableHook({
  features,
  debugTable: true,
  enableSortingRemoval: false,
})
```

Options passed to `createTableHook` become defaults for every table created by `createAppTable`. The `features` option is also bound to the returned column helper, so column definitions know that sorting APIs are available.

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

Create each table with `createAppTable`. The call site provides table-specific inputs such as `columns` and reactive `data`; shared features and defaults come from the hook.

```tsx
const [data, setData] = createSignal<Array<Person>>([])

const table = createAppTable({
  key: 'users-table',
  columns,
  get data() {
    return data()
  },
})
```

## Render With The Normal Table APIs

You can render the table with the same table instance APIs used by a standalone `createTable` table. This simple path does not require `AppTable`, `AppCell`, `AppHeader`, or registered components.

```tsx
return (
  <table>
    <thead>
      <For each={table.getHeaderGroups()}>
        {(headerGroup) => (
          <tr>
            <For each={headerGroup.headers}>
              {(header) => (
                <th onClick={header.column.getToggleSortingHandler()}>
                  <table.FlexRender header={header} />
                </th>
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
              {(cell) => (
                <td>
                  <table.FlexRender cell={cell} />
                </td>
              )}
            </For>
          </tr>
        )}
      </For>
    </tbody>
  </table>
)
```

## Override Shared Defaults Per Table

Options passed to `createAppTable` override defaults from `createTableHook`. Use this for the few tables that need different behavior without creating a separate app hook.

```tsx
const table = createAppTable({
  key: 'sortable-users-table',
  columns,
  get data() {
    return data()
  },
  enableSortingRemoval: true,
})
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

### Returned Helpers

| Helper | Purpose |
|---|---|
| `createAppTable` | Creates a Solid table with shared features, row models, defaults, and registered components. |
| `createAppColumnHelper` | Creates column helpers with `TFeatures` and registered component types already bound. |
| `useTableContext` | Reads the current table inside registered table components. |
| `useCellContext` | Reads the current cell inside registered cell components. |
| `useHeaderContext` | Reads the current header/footer inside registered header components. |

### Component Columns

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

### Component Table Rendering

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

### Reusing The Component Registry

The example creates `personColumnHelper` and `productColumnHelper` from the same `createAppColumnHelper`, then creates both Users and Products tables with `createAppTable`. Each table keeps its own signals and columns, while the shared hook owns features, row models, row IDs, and component conventions.

## When To Use This Pattern

Use `createTableHook` when multiple tables should share features, row models, default options, or conventions. Use the standalone `createTable` API for a one-off table. Add the component registry only when the app wants standardized reusable table UI pieces.

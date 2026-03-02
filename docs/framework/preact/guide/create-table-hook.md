---
title: createTableHook Guide
---

`createTableHook` is an advanced API for building reusable, composable table configurations in Preact. It mirrors the [React `createTableHook` API](../react/guide/create-table-hook) — you define features, row models, and pre-bound components once, then reuse them across multiple tables with minimal boilerplate.

> **When to use it:** Use `createTableHook` when you have multiple tables that share the same configuration. For a single table, `useTable` is sufficient.

## Setup

Create a shared table configuration file and call `createTableHook` with your features, row models, and component registries:

```tsx
// hooks/table.ts

import {
  createTableHook,
  tableFeatures,
  columnFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  sortFns,
} from '@tanstack/preact-table'

import { PaginationControls, RowCount, TableToolbar } from '../components/table-components'
import { TextCell, NumberCell, StatusCell } from '../components/cell-components'
import { SortIndicator, ColumnFilter } from '../components/header-components'

export const {
  createAppColumnHelper,
  useAppTable,
  useTableContext,
  useCellContext,
  useHeaderContext,
} = createTableHook({
  _features: tableFeatures({
    columnFilteringFeature,
    rowPaginationFeature,
    rowSortingFeature,
  }),

  _rowModels: {
    sortedRowModel: createSortedRowModel(sortFns),
    filteredRowModel: createFilteredRowModel(filterFns),
    paginatedRowModel: createPaginatedRowModel(),
  },

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
  },

  headerComponents: {
    SortIndicator,
    ColumnFilter,
  },
})
```

## What `createTableHook` Returns

| Export | Description |
|--------|-------------|
| `useAppTable` | Hook for creating tables. Merges default options from the hook with per-table options. |
| `createAppColumnHelper` | Column helper with `TFeatures` pre-bound. Only requires `TData`. |
| `useTableContext` | Access the table instance inside `tableComponents`. |
| `useCellContext` | Access the cell instance inside `cellComponents`. |
| `useHeaderContext` | Access the header instance inside `headerComponents`. |

## Component Registries

The API matches React's `createTableHook`:

- **`tableComponents`** — Components attached to the table (`table.PaginationControls`, etc.). Use `useTableContext()` inside them.
- **`cellComponents`** — Components attached to the cell (`cell.TextCell`, etc.). Use `useCellContext()` inside them.
- **`headerComponents`** — Components attached to the header (`header.SortIndicator`, etc.). Use `useHeaderContext()` inside them.

## Using `useAppTable`

```tsx
const personColumnHelper = createAppColumnHelper<Person>()

function UsersTable() {
  const [data, setData] = useState(() => makeData(100))

  const columns = useMemo(
    () =>
      personColumnHelper.columns([
        personColumnHelper.accessor('firstName', {
          header: 'First Name',
          cell: ({ cell }) => <cell.TextCell />,
        }),
        personColumnHelper.accessor('age', {
          header: 'Age',
          cell: ({ cell }) => <cell.NumberCell />,
        }),
      ]),
    [],
  )

  const table = useAppTable({
    columns,
    data,
  })

  return (
    <table.AppTable selector={(state) => ({ pagination: state.pagination })}>
      {() => (
        <div>
          <table.TableToolbar title="Users" onRefresh={() => setData(makeData(100))} />
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
                      {(cell) => <td><cell.FlexRender /></td>}
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
  )
}
```

## AppTable, AppHeader, AppCell, AppFooter

Same as React: `table.AppTable`, `table.AppHeader`, `table.AppCell`, and `table.AppFooter` provide context to your registered components. Use the `selector` prop on `AppTable` for optimized re-renders.

## See Also

- [React createTableHook Guide](../react/guide/create-table-hook) — The React guide has more detailed examples and the same API.
- [Composable Tables (React)](../react/examples/composable-tables) — Reference implementation (Preact API mirrors React).

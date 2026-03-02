---
title: createTableHook Guide
---

`createTableHook` is an advanced API for building reusable, composable table configurations. It lets you define features, row models, and pre-bound components once, then reuse them across multiple tables with minimal boilerplate. It is inspired by [TanStack Form's `createFormHook`](https://tanstack.com/form/latest/docs/framework/react/guides/form-composition).

> **When to use it:** Use `createTableHook` when you have multiple tables that share the same configuration (features, row models, and reusable components). For a single table, `useTable` is sufficient.

## Examples

- [Composable Tables](../examples/composable-tables) — Two tables (Users and Products) sharing the same `createTableHook` configuration, with table/cell/header components, sorting, filtering, and pagination.
- [Basic useAppTable](../examples/basic-use-app-table) — Minimal example using `createTableHook` with no pre-bound components.

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
} from '@tanstack/react-table'

import { PaginationControls, RowCount, TableToolbar } from '../components/table-components'
import { TextCell, NumberCell, StatusCell, ProgressCell } from '../components/cell-components'
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
    ProgressCell,
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
| `useAppTable` | Hook for creating tables. Merges default options from the hook with per-table options. No need to pass `_features` or `_rowModels`—they come from the hook. |
| `createAppColumnHelper` | Column helper with `TFeatures` pre-bound. Only requires `TData`. Use `createAppColumnHelper<Person>()` instead of `createColumnHelper<typeof _features, Person>()`. |
| `useTableContext` | Access the table instance inside `tableComponents`. |
| `useCellContext` | Access the cell instance inside `cellComponents`. |
| `useHeaderContext` | Access the header instance inside `headerComponents`. |

## Component Registries

### `tableComponents`

Components that need access to the **table instance**. They are attached to the table object, so you use them as `table.PaginationControls`, `table.RowCount`, etc.

Use `useTableContext()` inside these components:

```tsx
export function PaginationControls() {
  const table = useTableContext()

  return (
    <div className="pagination">
      <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
        Previous
      </button>
      <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
        Next
      </button>
    </div>
  )
}
```

### `cellComponents`

Components that render **cell content**. They are attached to the `cell` object in column definitions, so you use them as `cell.TextCell`, `cell.NumberCell`, etc.

Use `useCellContext()` inside these components:

```tsx
export function TextCell() {
  const cell = useCellContext<string>()
  return <span>{cell.getValue()}</span>
}

export function NumberCell() {
  const cell = useCellContext<number>()
  return <span>{cell.getValue().toLocaleString()}</span>
}
```

### `headerComponents`

Components that render **header/footer content**. They are attached to the `header` object, so you use them as `header.SortIndicator`, `header.ColumnFilter`, etc.

Use `useHeaderContext()` inside these components:

```tsx
export function SortIndicator() {
  const header = useHeaderContext()
  const sorted = header.column.getIsSorted()
  if (!sorted) return null
  return <span>{sorted === 'asc' ? '🔼' : '🔽'}</span>
}
```

## Using `useAppTable`

Create tables with `useAppTable`—`_features` and `_rowModels` are inherited from the hook:

```tsx
const personColumnHelper = createAppColumnHelper<Person>()

function UsersTable() {
  const [data, setData] = useState(() => makeData(1000))

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
        personColumnHelper.accessor('status', {
          header: 'Status',
          cell: ({ cell }) => <cell.StatusCell />,
        }),
      ]),
    [],
  )

  const table = useAppTable({
    columns,
    data,
    debugTable: true,
  })

  return (
    <table.AppTable selector={(state) => ({ pagination: state.pagination, sorting: state.sorting })}>
      {({ sorting }) => (
        <div>
          <table.TableToolbar title="Users" onRefresh={() => setData(makeData(1000))} />
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

The table returned by `useAppTable` includes wrapper components that provide context to your registered components:

- **`table.AppTable`** — Wraps the table UI and provides a `selector` prop for optimized re-renders. Renders its children with the selected state.
- **`table.AppHeader`** — Wraps a header and provides the enhanced `header` context (with `header.SortIndicator`, `header.ColumnFilter`, etc.) to its render prop.
- **`table.AppCell`** — Wraps a cell and provides the enhanced `cell` context (with `cell.TextCell`, `cell.FlexRender`, etc.) to its render prop.
- **`table.AppFooter`** — Same as AppHeader but for footer cells.

## Optimized Rendering with `selector`

Pass a `selector` to `table.AppTable` to subscribe only to the state slices you need. This reduces re-renders when other state (e.g., column filters) changes but your component doesn't use it:

```tsx
<table.AppTable
  selector={(state) => ({
    pagination: state.pagination,
    sorting: state.sorting,
    columnFilters: state.columnFilters,
  })}
>
  {({ sorting, columnFilters }) => (
    // This only re-renders when pagination, sorting, or columnFilters change
    <div>...</div>
  )}
</table.AppTable>
```

For v8-style behavior (re-render on any state change), pass `(state) => state`.

## Multiple Table Configurations

You can call `createTableHook` multiple times for different parts of your app:

```tsx
// admin-tables.ts
export const { useAppTable: useAdminTable, createAppColumnHelper: createAdminColumnHelper } =
  createTableHook({
    _features: tableFeatures({ rowSortingFeature, columnFilteringFeature, rowSelectionFeature }),
    _rowModels: { /* ... */ },
    cellComponents: { EditableCell, DeleteButton },
  })

// readonly-tables.ts
export const { useAppTable: useReadonlyTable, createAppColumnHelper: createReadonlyColumnHelper } =
  createTableHook({
    _features: tableFeatures({ rowSortingFeature }),
    _rowModels: { /* ... */ },
    cellComponents: { TextCell, NumberCell },
  })
```

## See Also

- [Migrating to v9](./migrating) — Includes a createTableHook section
- [Composable Tables example](../examples/composable-tables) — Full implementation with two tables

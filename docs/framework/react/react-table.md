---
title: React Table
---

The `@tanstack/react-table` adapter wraps `@tanstack/table-core` with React-specific reactivity, rendering helpers, and types. It installs the React `coreReativityFeature` for you, so table state is backed by TanStack Store atoms while React components can subscribe through `useTable`, selectors, and `table.Subscribe`.

TanStack Table v9 is explicit about what a table uses. Register features with `_features`, and register client-side row model factories with `_rowModels`. The core row model is included by default, so a basic table can use `_rowModels: {}`.

## Creating a Table

Use `useTable` to create a React table instance.

```tsx
import { tableFeatures, useTable, type ColumnDef } from '@tanstack/react-table'

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

function App({ data }: { data: Person[] }) {
  const table = useTable({
    _features,
    _rowModels: {},
    columns,
    data,
  })

  return null
}
```

For feature-specific row models, register the feature and put the row model factory under `_rowModels`.

```tsx
import {
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/react-table'

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

Use `atoms` when your app should own one state slice with TanStack Store. Use `state` with the matching `on[State]Change` option for simple React state integration or migration paths.

```tsx
import { useCreateAtom } from '@tanstack/react-store'
import {
  rowPaginationFeature,
  tableFeatures,
  useTable,
  type PaginationState,
} from '@tanstack/react-table'

const _features = tableFeatures({
  rowPaginationFeature,
})

function App({ data }: { data: Person[] }) {
  const paginationAtom = useCreateAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useTable({
    _features,
    _rowModels: {},
    columns,
    data,
    atoms: {
      pagination: paginationAtom,
    },
  })

  return null
}
```

For reactive reads, the second argument to `useTable` selects from `table.store` and exposes the result on `table.state`. For large tables, `table.Subscribe` can subscribe smaller parts of the UI to selected state or individual atoms. See the [Table State Guide](./guide/table-state.md) and the [Basic Subscribe example](./examples/basic-subscribe).

## Rendering Headers, Cells, and Footers

Use `table.FlexRender` to render column `header`, `cell`, and `footer` definitions. It handles plain values and React components.

```tsx
<tbody>
  {table.getRowModel().rows.map((row) => (
    <tr key={row.id}>
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id}>
          <table.FlexRender cell={cell} />
        </td>
      ))}
    </tr>
  ))}
</tbody>
```

## createTableHook

`createTableHook` creates an app-specific table hook. Use it when multiple tables should share `_features`, `_rowModels`, default options, column helpers, and component conventions.

```tsx
import { createTableHook, tableFeatures } from '@tanstack/react-table'

const { useAppTable, createAppColumnHelper } = createTableHook({
  _features: tableFeatures({}),
  _rowModels: {},
})

const columnHelper = createAppColumnHelper<Person>()

function App({ data }: { data: Person[] }) {
  const table = useAppTable({
    columns,
    data,
  })

  return null
}
```

See the [createTableHook Guide](./guide/create-table-hook.md) and the [Composable Tables example](./examples/composable-tables) for the full pattern.

## API Reference

See the [React API Reference](./reference/index.md).

---
title: Solid Table
---

The `@tanstack/solid-table` adapter wraps `@tanstack/table-core` with Solid-specific reactivity, rendering helpers, and types. It installs the Solid `coreReativityFeature` for you, so table atoms participate in Solid dependency tracking and can update computations with fine-grained precision.

TanStack Table v9 is explicit about what a table uses. Register features with `_features`, and register client-side row model factories with `_rowModels`. The core row model is included by default, so a basic table can use `_rowModels: {}`.

## Creating a Table

Use `createTable` to create a Solid table instance.

```tsx
import { createTable, tableFeatures, type ColumnDef } from '@tanstack/solid-table'

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

function App(props: { data: Person[] }) {
  const table = createTable({
    _features,
    _rowModels: {},
    columns,
    get data() {
      return props.data
    },
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
} from '@tanstack/solid-table'

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

Use `atoms` when your app should own one state slice with TanStack Store. Use `state` with the matching `on[State]Change` option for simple Solid state integration or migration paths. Selected table state is available through the `table.state()` accessor when you pass a selector to `createTable`.

```tsx
import { createAtom } from '@tanstack/solid-store'
import {
  createTable,
  rowPaginationFeature,
  tableFeatures,
  type PaginationState,
} from '@tanstack/solid-table'

const _features = tableFeatures({
  rowPaginationFeature,
})

const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const table = createTable({
  _features,
  _rowModels: {},
  columns,
  data,
  atoms: {
    pagination: paginationAtom,
  },
})
```

See the [Table State Guide](./guide/table-state.md) for selectors, external atoms, and state ownership patterns.

## Rendering Headers, Cells, and Footers

Use `table.FlexRender` to render column `header`, `cell`, and `footer` definitions. It handles plain values and Solid components.

```tsx
<tbody>
  <For each={table.getRowModel().rows}>
    {(row) => (
      <tr>
        <For each={row.getVisibleCells()}>
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
```

## createTableHook

`createTableHook` creates an app-specific table creator. Use it when multiple tables should share `_features`, `_rowModels`, default options, column helpers, and component conventions.

```tsx
import { createTableHook, tableFeatures } from '@tanstack/solid-table'

const { createAppTable, createAppColumnHelper } = createTableHook({
  _features: tableFeatures({}),
  _rowModels: {},
})

const columnHelper = createAppColumnHelper<Person>()

function App(props: { data: Person[] }) {
  const table = createAppTable({
    columns,
    get data() {
      return props.data
    },
  })

  return null
}
```

See the [Composable Tables example](./examples/composable-tables) for the full pattern.

## API Reference

See the [Solid API Reference](./reference/index.md).

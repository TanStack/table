---
title: Helpers Guide
---

## Helpers Guide

TanStack Table exposes a few small helper functions for authoring table configuration with better TypeScript inference. They do not add behavior by themselves. Instead, they help TypeScript preserve the relationship between your feature set, row type, column definitions, table options, and named function registries.

The most common helpers are:

- `tableFeatures` - defines the static feature set and feature-related slots for a table
- `tableOptions` - preserves inference when composing reusable table options
- `createColumnHelper` - creates strongly typed column definitions

These helpers are exported from every framework adapter and from `@tanstack/table-core`.

## `tableFeatures`

Use `tableFeatures()` to declare which features a table uses. Features are opt-in in v9, so the object you pass to this helper determines which feature APIs and state slices exist on the table, columns, rows, headers, and cells.

For a basic table that only needs core behavior, pass an empty object:

```ts
import { tableFeatures } from '@tanstack/react-table'

const features = tableFeatures({})
```

Add feature objects and row model factories when your table needs extra behavior:

```ts
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createSortedRowModel,
  filterFns,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/react-table'

const features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns,
  sortFns,
})
```

Keep `features` stable. In most apps, define it outside your component or in shared table setup code. Since `typeof features` is used throughout the table's types, stable features also make it easier to reuse column helpers, column definitions, and shared options.

### What goes in `tableFeatures`

`tableFeatures()` is the static configuration point for things that are stitched into a table before it is created:

- Feature objects such as `rowSortingFeature`, `columnFilteringFeature`, or custom features
- Row model factories such as `createSortedRowModel()` and `createFilteredRowModel()`
- Function registries such as `filterFns`, `sortFns`, and `aggregationFns`
- Type-only slots such as `tableMeta` and `columnMeta`, usually declared with `metaHelper`

`metaHelper()` is useful when declaring type-only meta slots in `tableFeatures()`. It is equivalent to writing `{} as MyMeta`, but makes the intent clearer and avoids lint rules accidentally removing the type assertion:

```ts
import { metaHelper, rowSortingFeature, tableFeatures } from '@tanstack/react-table'

type MyTableMeta = {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void
}

type MyColumnMeta = {
  align?: 'left' | 'right'
}

const features = tableFeatures({
  rowSortingFeature,
  tableMeta: metaHelper<MyTableMeta>(),
  columnMeta: metaHelper<MyColumnMeta>(),
})
```

For more detail on `tableMeta`, `columnMeta`, and `metaHelper`, see the [Table and Column Meta Guide](./table-and-column-meta).

Function registry keys become valid string references in table and column options:

```ts
import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/react-table'

type Person = {
  rank: number
}

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    ...sortFns,
    byRank: (rowA, rowB, columnId) => {
      return rowA.getValue<number>(columnId) - rowB.getValue<number>(columnId)
    },
  },
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('rank', {
    sortFn: 'byRank',
  }),
])
```

For more detail on row model slots and function registries, see the [Row Models Guide](./row-models).

## `tableOptions`

Use `tableOptions()` when you want to compose reusable table option objects while keeping TanStack Table's generic inference intact. The helper returns the same object at runtime; its value is in the TypeScript overloads.

This is useful for shared defaults:

```ts
import { tableFeatures, tableOptions, useTable } from '@tanstack/react-table'

const features = tableFeatures({})

const sharedOptions = tableOptions({
  features,
  defaultColumn: {
    minSize: 80,
    maxSize: 400,
  },
  debugTable: true,
})

const table = useTable({
  ...sharedOptions,
  columns,
  data,
})
```

It is also useful when a wrapper or table factory supplies required options later. For example, a reusable option fragment can omit `data`, `columns`, or `features` and still keep the remaining table option types connected to the same feature set and row type:

```ts
import {
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
  tableOptions,
  useTable,
} from '@tanstack/react-table'

type Person = {
  firstName: string
  lastName: string
  age: number
}

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
})

const sortableDefaults = tableOptions<typeof features, Person>({
  initialState: {
    sorting: [{ id: 'lastName', desc: false }],
  },
})

const table = useTable({
  features,
  columns,
  data,
  ...sortableDefaults,
})
```

Use `tableOptions()` for reusable configuration. For one-off table setup, passing the object directly to your adapter's table creation function is usually enough.

## `createColumnHelper`

`createColumnHelper()` creates a small set of utilities for authoring column definitions:

- `accessor` creates data columns from an accessor key or accessor function
- `display` creates display-only columns such as actions or selection controls
- `group` creates parent columns that contain nested columns
- `columns` wraps arrays of column definitions to preserve each column's individual value type

The helper is typed by both your feature set and row type:

```ts
import { createColumnHelper, tableFeatures } from '@tanstack/react-table'

type Person = {
  firstName: string
  lastName: string
  age: number
}

const features = tableFeatures({})
const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: 'Last Name',
  }),
  columnHelper.display({
    id: 'actions',
    cell: (info) => `Actions for ${info.row.id}`,
  }),
])
```

At runtime, the column helper only returns column definition objects. Its main purpose is to infer accessor values, feature-specific column options, and nested column arrays more precisely than plain object literals can in some TypeScript scenarios.

Column definitions have their own guide with the full details on accessor columns, display columns, grouping columns, IDs, and rendering. See the [Column Defs Guide](./column-defs).

## When to Use Each Helper

Use `tableFeatures()` for every v9 table. Even an empty `tableFeatures({})` call clearly declares that the table only uses core features.

Use `tableOptions()` when options are shared, composed, or supplied in multiple steps. Skip it when the options object is only passed directly to `useTable`, `createTable`, `injectTable`, `TableController`, or `constructTable`.

Use `createColumnHelper()` when you want strong column inference, especially for accessor values, custom feature options, and nested column groups. Plain `ColumnDef` objects are still valid when they are easier for your use case.

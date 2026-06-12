---
title: Table and Column Meta Guide
---

## Table and Column Meta Guide

Sometimes you need to attach your own arbitrary data or functions to a table or its columns so that they are available anywhere the `table` or `column` instances are available. That is what the `meta` options are for. TanStack Table never reads or writes `meta` itself; it is purely a place for you to pass your own context through the table.

There are two kinds of meta:

- **Table meta** - The `meta` table option. Pass any object and read it back anywhere via `table.options.meta`. A classic use case is passing an `updateData` function down to editable cells.
- **Column meta** - The `meta` property on a column definition. Read it back anywhere a column is available via `column.columnDef.meta`. A classic use case is declaring which filter UI variant a column's header should render.

<!-- ::start:framework -->

# React

```ts
const table = useTable({
  features,
  columns,
  data,
  meta: {
    updateData: (rowIndex, columnId, value) => {
      // ...
    },
  },
})

// ...later, anywhere the table is available (e.g. inside a cell component)
table.options.meta?.updateData(rowIndex, columnId, newValue)
```

# Preact

```ts
const table = useTable({
  features,
  columns,
  data,
  meta: {
    updateData: (rowIndex, columnId, value) => {
      // ...
    },
  },
})

// ...later, anywhere the table is available (e.g. inside a cell component)
table.options.meta?.updateData(rowIndex, columnId, newValue)
```

# Vue

```ts
const table = useTable({
  features,
  columns,
  data,
  meta: {
    updateData: (rowIndex, columnId, value) => {
      // ...
    },
  },
})

// ...later, anywhere the table is available (e.g. inside a cell component)
table.options.meta?.updateData(rowIndex, columnId, newValue)
```

# Solid

```ts
const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
  meta: {
    updateData: (rowIndex, columnId, value) => {
      // ...
    },
  },
})

// ...later, anywhere the table is available (e.g. inside a cell component)
table.options.meta?.updateData(rowIndex, columnId, newValue)
```

# Svelte

```ts
const table = createTable({
  features,
  columns,
  get data() {
    return data
  },
  meta: {
    updateData: (rowIndex, columnId, value) => {
      // ...
    },
  },
})

// ...later, anywhere the table is available (e.g. inside a cell component)
table.options.meta?.updateData(rowIndex, columnId, newValue)
```

# Angular

```ts
readonly table = injectTable(() => ({
  features,
  columns,
  data: this.data(),
  meta: {
    updateData: (rowIndex, columnId, value) => {
      // ...
    },
  },
}))

// ...later, anywhere the table is available (e.g. inside a cell component)
table.options.meta?.updateData(rowIndex, columnId, newValue)
```

# Lit

```ts
const table = this.tableController.table({
  features,
  columns,
  data: this.data,
  meta: {
    updateData: (rowIndex, columnId, value) => {
      // ...
    },
  },
})

// ...later, anywhere the table is available (e.g. inside a cell component)
table.options.meta?.updateData(rowIndex, columnId, newValue)
```

# Vanilla

```ts
const table = constructTable({
  features,
  columns,
  data,
  meta: {
    updateData: (rowIndex, columnId, value) => {
      // ...
    },
  },
})

// ...later, anywhere the table is available (e.g. inside a cell component)
table.options.meta?.updateData(rowIndex, columnId, newValue)
```

<!-- ::end:framework -->

Column meta is set on the column definition and is identical across every adapter:

```ts
const columns = columnHelper.columns([
  columnHelper.accessor('age', {
    header: 'Age',
    meta: {
      filterVariant: 'range',
    },
  }),
])

// ...later, anywhere a column is available (e.g. inside a header component)
const variant = column.columnDef.meta?.filterVariant
```

### Typing Meta Per-Table (Recommended)

By default, both meta types are empty objects, so to get type safety you declare their shapes yourself. New in v9, you can declare meta types **per features set** with the type-only `tableMeta` and `columnMeta` slots in your `tableFeatures()` call, using the `metaHelper` utility.

First, define the shapes you want (this is the same in every framework):

```ts
interface MyTableMeta {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void
}

interface MyColumnMeta {
  filterVariant?: 'text' | 'range' | 'select'
}
```

Then declare them on your `features` object:

<!-- ::start:framework -->

# React

```ts
import { metaHelper, rowSortingFeature, tableFeatures } from '@tanstack/react-table'

const features = tableFeatures({
  rowSortingFeature,
  tableMeta: metaHelper<MyTableMeta>(),
  columnMeta: metaHelper<MyColumnMeta>(),
})
```

# Preact

```ts
import { metaHelper, rowSortingFeature, tableFeatures } from '@tanstack/preact-table'

const features = tableFeatures({
  rowSortingFeature,
  tableMeta: metaHelper<MyTableMeta>(),
  columnMeta: metaHelper<MyColumnMeta>(),
})
```

# Vue

```ts
import { metaHelper, rowSortingFeature, tableFeatures } from '@tanstack/vue-table'

const features = tableFeatures({
  rowSortingFeature,
  tableMeta: metaHelper<MyTableMeta>(),
  columnMeta: metaHelper<MyColumnMeta>(),
})
```

# Solid

```ts
import { metaHelper, rowSortingFeature, tableFeatures } from '@tanstack/solid-table'

const features = tableFeatures({
  rowSortingFeature,
  tableMeta: metaHelper<MyTableMeta>(),
  columnMeta: metaHelper<MyColumnMeta>(),
})
```

# Svelte

```ts
import { metaHelper, rowSortingFeature, tableFeatures } from '@tanstack/svelte-table'

const features = tableFeatures({
  rowSortingFeature,
  tableMeta: metaHelper<MyTableMeta>(),
  columnMeta: metaHelper<MyColumnMeta>(),
})
```

# Angular

```ts
import { metaHelper, rowSortingFeature, tableFeatures } from '@tanstack/angular-table'

const features = tableFeatures({
  rowSortingFeature,
  tableMeta: metaHelper<MyTableMeta>(),
  columnMeta: metaHelper<MyColumnMeta>(),
})
```

# Lit

```ts
import { metaHelper, rowSortingFeature, tableFeatures } from '@tanstack/lit-table'

const features = tableFeatures({
  rowSortingFeature,
  tableMeta: metaHelper<MyTableMeta>(),
  columnMeta: metaHelper<MyColumnMeta>(),
})
```

# Vanilla

```ts
import { metaHelper, rowSortingFeature, tableFeatures } from '@tanstack/table-core'
import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings'

const features = tableFeatures({
  coreReactivityFeature: storeReactivityBindings(),
  rowSortingFeature,
  tableMeta: metaHelper<MyTableMeta>(),
  columnMeta: metaHelper<MyColumnMeta>(),
})
```

<!-- ::end:framework -->

That's it. Everywhere this `features` object flows (`useTable`, `createColumnHelper`, `ColumnDef`, `Column`, and so on), the meta types are inferred from `typeof features` with no extra generics to pass around:

```ts
const columnHelper = createColumnHelper<typeof features, Person>()

columnHelper.accessor('age', {
  meta: {
    filterVariant: 'range', // ✅ type-checked against MyColumnMeta
  },
})

// And both meta surfaces are fully typed wherever you read them:
table.options.meta?.updateData // ✅ (rowIndex, columnId, value) => void
column.columnDef.meta?.filterVariant // ✅ 'text' | 'range' | 'select' | undefined
```

Unlike the v8-style declaration merging described below, this scoping is **per-table, not global**: only tables created with this `features` object get these meta types. Different tables in your app can declare entirely different meta shapes by using different `features` objects.

#### How the Type-Only Slots Work

The `tableMeta` and `columnMeta` keys are *phantom* entries: only their TypeScript types matter. At runtime, the value is an empty object that gets stripped from the table's registered features, so it is never treated as a real feature. The actual meta *values* are still passed where they always were: the `meta` table option and the `meta` property on column definitions.

`metaHelper<MyMeta>()` simply returns `{}` cast to your meta type. You can write the cast yourself instead:

```ts
const features = tableFeatures({
  rowSortingFeature,
  tableMeta: {} as MyTableMeta,
  columnMeta: {} as MyColumnMeta,
})
```

Both forms are equivalent. Prefer `metaHelper`: it reads as type-only at a glance, and it avoids false positives from the `@typescript-eslint/no-unnecessary-type-assertion` lint rule, which flags the `{} as` form when your meta type has only optional properties (and whose auto-fix would silently erase your meta type).

### Filter Meta (`filterMeta` Slot)

The `filterMeta` slot lets you declare the shape of arbitrary metadata that a custom filter function attaches to a row during filtering. This is most useful for filter functions that produce a by-product (such as a ranking score) that you want to read in a column's sort function or cell renderer.

The pattern mirrors `tableMeta` and `columnMeta`: declare your meta interface, register it with `metaHelper`, and then intersect `TableFeatures` with your meta type when annotating your filter and sort functions.

```ts
import {
  metaHelper,
  tableFeatures,
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  createFilteredRowModel,
  createSortedRowModel,
  createPaginatedRowModel,
  filterFns,
  sortFns,
} from '@tanstack/react-table'
import type { FilterFn, SortFn, RowData, TableFeatures } from '@tanstack/react-table'
import { rankItem, type RankingInfo } from '@tanstack/match-sorter-utils'

// 1. Define the metadata shape your filter function will attach
interface FuzzyFilterMeta {
  itemRank?: RankingInfo
}

// 2. Intersect with TableFeatures to get a fully typed features surface
type FuzzyFeatures = TableFeatures & { filterMeta: FuzzyFilterMeta }

// 3. Annotate your filter and sort functions against the extended features type
const fuzzyFilter: FilterFn<FuzzyFeatures, RowData> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const fuzzySort: SortFn<FuzzyFeatures, Person> = (rowA, rowB, columnId) => {
  let dir = 0
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!,
    )
  }
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

// 4. Register everything on tableFeatures() — including the filterMeta slot
const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { ...filterFns, fuzzy: fuzzyFilter },
  sortFns: { ...sortFns, fuzzy: fuzzySort },
  filterMeta: metaHelper<FuzzyFilterMeta>(),
})
```

Now `columnFiltersMeta` on every row is typed as `FuzzyFilterMeta` for tables built from this `features` object. The `filterMeta` slot is, like `tableMeta` and `columnMeta`, a phantom type-only entry: `metaHelper<FuzzyFilterMeta>()` returns `{}` at runtime and is stripped from the registered features.

See the [React filters-fuzzy example](../framework/react/examples/filters-fuzzy) for a complete, runnable implementation.

### Typing Meta Globally with Declaration Merging (v8 Style)

The v8 approach of extending the `TableMeta` and `ColumnMeta` interfaces with module augmentation still works in v9. The only change from v8 is the generics shape: `TFeatures` is now the first type parameter on both interfaces.

<!-- ::start:framework -->

# React

```ts
import type { CellData, RowData, TableFeatures } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface TableMeta<TFeatures extends TableFeatures, TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }

  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  > {
    filterVariant?: 'text' | 'range' | 'select'
  }
}
```

# Preact

```ts
import type { CellData, RowData, TableFeatures } from '@tanstack/preact-table'

declare module '@tanstack/preact-table' {
  interface TableMeta<TFeatures extends TableFeatures, TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }

  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  > {
    filterVariant?: 'text' | 'range' | 'select'
  }
}
```

# Vue

```ts
import type { CellData, RowData, TableFeatures } from '@tanstack/vue-table'

declare module '@tanstack/vue-table' {
  interface TableMeta<TFeatures extends TableFeatures, TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }

  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  > {
    filterVariant?: 'text' | 'range' | 'select'
  }
}
```

# Solid

```ts
import type { CellData, RowData, TableFeatures } from '@tanstack/solid-table'

declare module '@tanstack/solid-table' {
  interface TableMeta<TFeatures extends TableFeatures, TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }

  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  > {
    filterVariant?: 'text' | 'range' | 'select'
  }
}
```

# Svelte

```ts
import type { CellData, RowData, TableFeatures } from '@tanstack/svelte-table'

declare module '@tanstack/svelte-table' {
  interface TableMeta<TFeatures extends TableFeatures, TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }

  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  > {
    filterVariant?: 'text' | 'range' | 'select'
  }
}
```

# Angular

```ts
import type { CellData, RowData, TableFeatures } from '@tanstack/angular-table'

declare module '@tanstack/angular-table' {
  interface TableMeta<TFeatures extends TableFeatures, TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }

  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  > {
    filterVariant?: 'text' | 'range' | 'select'
  }
}
```

# Lit

```ts
import type { CellData, RowData, TableFeatures } from '@tanstack/lit-table'

declare module '@tanstack/lit-table' {
  interface TableMeta<TFeatures extends TableFeatures, TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }

  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  > {
    filterVariant?: 'text' | 'range' | 'select'
  }
}
```

# Vanilla

```ts
import type { CellData, RowData, TableFeatures } from '@tanstack/table-core'

declare module '@tanstack/table-core' {
  interface TableMeta<TFeatures extends TableFeatures, TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }

  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  > {
    filterVariant?: 'text' | 'range' | 'select'
  }
}
```

<!-- ::end:framework -->

The trade-off with declaration merging is that it is **global**. Every table in your entire project gets the same meta types, whether or not a given table actually provides that meta. If you have many tables with different needs, the per-table slots above are a better fit.

The two approaches resolve with a simple precedence: if a `features` object declares a `tableMeta` or `columnMeta` slot, that slot's type is used for tables created with those features, *replacing* (not merging with) the globally declared interface. Tables whose features declare no slot fall back to the declaration-merged interfaces.

### When to Use Custom Features Instead

Meta is intentionally simple: a typed bag of values you carry through the table. If you find yourself wanting real table *options* with defaults, new *state*, or new *APIs* on the table instance (e.g. `table.toggleDensity()`), consider writing a [custom feature](../framework/react/guide/custom-features) instead. Custom features plug into the same `features` option, get the same `typeof features` type inference, and can declare their own options, state, and instance methods. Meta was never designed to do any of that.

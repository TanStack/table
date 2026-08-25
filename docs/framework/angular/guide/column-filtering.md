---
title: Column Filtering (Angular) Guide
---

## Examples

Want to skip to the implementation? Check out these Angular examples:

- [Column Filters](../examples/filters)
- [Faceted Filters](../examples/filters-faceted)
- [Bucketed Faceted Filters](../examples/filters-faceted-bucketed)
- [Fuzzy Search](../examples/filters-fuzzy)

### Column Filtering Setup

Here's how you set up your table to use column filtering features. Adding the column filtering feature enables the related APIs. If you use client-side filtering, also set up `filteredRowModel` after its feature, since row model slots are type-checked.

```ts
import { signal } from '@angular/core'
import {
  injectTable,
  tableFeatures,
  columnFilteringFeature,
  createFilteredRowModel,
  filterFn_includesString,
  filterFn_inNumberRange,
} from '@tanstack/angular-table'

const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(), // if using client-side filtering
  // manualFiltering: true, // if using manual server-side filtering
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
})

export class App {
  readonly data = signal(defaultData)

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
  }))
}
```

> [!NOTE]
> The `filterFns` registry above lists only the built-in filter functions this table uses. Spreading the entire built-in `filterFns` registry (`filterFns: { ...filterFns }`) still works, but it puts every built-in filter function in your bundle. Register just the functions you use, or pass a function directly to the `filterFn` column option with no registration at all.

## Column Filtering (Angular) Guide

Filtering comes in 2 flavors: Column Filtering and Global Filtering.

This guide will focus on column filtering, which is a filter that is applied to a single column's accessor value.

TanStack table supports both client-side and manual server-side filtering. This guide will go over how to implement and customize both, and help you decide which one is best for your use-case.

### Client-Side vs Server-Side Filtering

Filtering should operate over the same dataset as sorting and pagination. Use client-side filtering when the browser has the complete dataset; use server-side filtering when it has only a page or another subset, unless filtering just the loaded rows is intentional.

See the [Client-Side vs Server-Side Guide](../../../guide/client-side-vs-server-side) for the full decision framework, performance factors, and guidance for combining data operations.

The client-side filtered row model also invokes the page-index auto-reset hook when column filtering inputs change. Whether the page index resets depends on the `autoResetPageIndex`, `autoResetAll`, and `manualPagination` options. If filtering is manual and this row model is omitted or bypassed, a column filter state change does not invoke that hook, so reset server-side pagination in the filter change handler when needed.

### Manual Server-Side Filtering

If you have decided that you need to implement server-side filtering instead of using the built-in client-side filtering, here's how you do that.

No `filteredRowModel` is needed for manual server-side filtering. Instead, the `data` that you pass to the table should already be filtered. However, if you have added a `filteredRowModel` to features, you can tell the table to skip it by setting the `manualFiltering` option to `true`.

```ts
const features = tableFeatures({ columnFilteringFeature })

readonly table = injectTable(() => ({
  features,
  data,
  columns,
  manualFiltering: true,
}))
```

> [!NOTE]
> When using manual filtering, many of the options that are discussed in the rest of this guide will have no effect. When `manualFiltering` is set to `true`, the table instance will not apply any filtering logic to the rows that are passed to it. Instead, it will assume that the rows are already filtered and will use the `data` that you pass to it as-is.

### Client-Side Filtering

If you are using the built-in client-side filtering features, add the `columnFilteringFeature` and the `filteredRowModel` factory to your features. Import `createFilteredRowModel` and the filter functions you need from TanStack Table:

```ts
import {
  injectTable,
  tableFeatures,
  columnFilteringFeature,
  createFilteredRowModel,
  filterFn_includesString,
  filterFn_inNumberRange,
} from '@tanstack/angular-table'

const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
})

readonly table = injectTable(() => ({
  features,
  data,
  columns,
}))
```

### Column Filter State

Whether or not you use client-side or server-side filtering, you can take advantage of the built-in column filter state management that TanStack Table provides. There are many table and column APIs to mutate and interact with the filter state and retrieve the column filter state.

The column filtering state is defined as an array of objects with the following shape:

```ts
interface ColumnFilter {
  id: string
  value: unknown
}
type ColumnFiltersState = ColumnFilter[]
```

Since the column filter state is an array of objects, you can have multiple column filters applied at once.

#### Accessing Column Filter State

You can access the column filter state from the table instance with `table.atoms.columnFilters.get()`. In Angular, table atom reads are signal reads, so reading the atom in a template expression, `computed(...)`, or `effect(...)` automatically tracks updates. Use `table.store.get()` only when you need a flat snapshot of the whole state, such as debug JSON.

```ts
readonly table = injectTable(() => ({
  features,
  columns,
  data,
  //...
}))

// signal-reactive in templates, computed(...), and effect(...)
this.table.atoms.columnFilters.get()
```

However, if you need access to the column filter state outside of the table, you can "control" the column filter state like down below.

### Controlled Column Filter State

If you need easy access to the column filter state in other parts of your application, you can own the column filter state slice yourself. The recommended way in v9 is an external atom (created with `createAtom` from `@tanstack/angular-store`) passed through the `atoms` table option. Atoms preserve fine-grained subscriptions, and the filter values can be used elsewhere (such as in a query key for server-side filtering) without re-running the `injectTable` options initializer on every change.

```ts
import { createAtom } from '@tanstack/angular-store'

export class App {
  readonly columnFiltersAtom = createAtom<ColumnFiltersState>([]) // can set initial column filter state here

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    //...
    atoms: {
      columnFilters: this.columnFiltersAtom, // table filter APIs now update columnFiltersAtom
    },
  }))

  // read the atom wherever you need the value (e.g. for a query key)
  // this.columnFiltersAtom.get()
}
```

Alternatively, the v8-style `state.columnFilters` plus `onColumnFiltersChange` pattern is still supported. In Angular this means owning the slice with an Angular signal, as shown in the [Basic External State example](../examples/basic-external-state). It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
readonly columnFilters = signal<ColumnFiltersState>([])
//...
readonly table = injectTable(() => ({
  features,
  columns,
  data: this.data(),
  //...
  state: {
    columnFilters: this.columnFilters(),
  },
  onColumnFiltersChange: (updater) =>
    typeof updater === 'function'
      ? this.columnFilters.update(updater)
      : this.columnFilters.set(updater),
}))
```

#### Initial Column Filter State

If you do not need to control the column filter state in your own state management or scope, but you still want to set an initial column filter state, you can use the `initialState` table option instead of `state`.

```ts
readonly table = injectTable(() => ({
  features,
  columns,
  data,
  //...
  initialState: {
    columnFilters: [
      {
        id: 'name',
        value: 'John', // filter the name column by 'John' by default
      },
    ],
  },
}))
```

> [!NOTE]
> Do not use both `initialState.columnFilters` and `state.columnFilters` at the same time, as the controlled `state.columnFilters` value will override the `initialState.columnFilters`.

### FilterFns

Each column can have its own unique filtering logic. Choose from any of the filter functions that are provided by TanStack Table, or create your own.

By default there are 18 built-in filter functions to choose from:

- `includesString` - Case-insensitive string inclusion
- `includesStringSensitive` - Case-sensitive string inclusion
- `startsWith` - Case-insensitive string prefix match
- `endsWith` - Case-insensitive string suffix match
- `equalsString` - Case-insensitive string equality
- `equalsStringSensitive` - Case-sensitive string equality
- `equals` - Strict equality `===`
- `weakEquals` - Weak equality `==`
- `empty` - The row's value is nullish or whitespace-only (the filter value is an on/off flag)
- `notEmpty` - The row's value is not nullish or whitespace-only (the filter value is an on/off flag)
- `arrIncludes` - The row's array (or string) value includes at least one of the filter values
- `arrIncludesAll` - The row's array value includes every filter value
- `arrIncludesSome` - The row's array value includes at least one of the filter values
- `arrHas` - The row's scalar value equals at least one of the filter values
- `inNumberRange` - Inclusive `[min, max]` number range (endpoints normalized and swapped if reversed)
- `inDateRange` - Inclusive `[min, max]` date range accepting `Date` objects, timestamps, or date strings (blank endpoints are open-ended)
- `between` - Exclusive min/max range (blank endpoints are open-ended)
- `betweenInclusive` - Inclusive min/max range (blank endpoints are open-ended)

You can also define your own custom filter functions, either inline as the `filterFn` column option, or by name in the `filterFns` registry slot on `tableFeatures`.

#### Custom Filter Functions

> [!NOTE]
> These filter functions only run during client-side filtering.

Whether you register a custom filter function in the `filterFns` slot on `tableFeatures` or pass it directly as a `filterFn` column option, it should have the following signature:

```ts
const myCustomFilterFn: FilterFn<typeof features, MyData> = (
  row, // Row<typeof features, MyData>
  columnId: string,
  filterValue: any,
  addMeta?: (meta: FilterMeta) => void,
): boolean => ...
```

Every filter function receives:

- The row to filter
- The columnId to use to retrieve the row's value
- The filter value

and should return `true` if the row should be included in the filtered rows, and `false` if it should be removed.

```ts
const columns = [
  {
    header: () => 'Name',
    accessorKey: 'name',
    filterFn: 'includesString', // use built-in filter function
  },
  {
    header: () => 'Age',
    accessorKey: 'age',
    filterFn: 'inNumberRange',
  },
  {
    header: () => 'Birthday',
    accessorKey: 'birthday',
    filterFn: 'myCustomFilterFn', // reference a custom filter function registered in features
  },
  {
    header: () => 'Profile',
    accessorKey: 'profile',
    // use custom filter function directly
    filterFn: (row, columnId, filterValue) => {
      return // true or false based on your custom logic
    },
  }
]
//...
const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
    myCustomFilterFn: (row, columnId, filterValue) => {
      return // true or false based on your custom logic
    },
    startsWith: startsWithFilterFn, // defined elsewhere
  },
})

readonly table = injectTable(() => ({
  features,
  columns,
  data,
}))
```

> **TypeScript Note:** For `filterFn: 'myCustomFilterFn'` string references to typecheck, register the function in the `filterFns` slot on `tableFeatures` (as shown above). Alternatively, skip the registry entirely by passing the function directly to the `filterFn` column option. See the [Fuzzy Search example](../examples/filters-fuzzy) for a complete registration example.

##### Customize Filter Function Behavior

You can attach a few other properties to filter functions to customize their behavior:

- `filterFn.resolveFilterValue` - This optional "hanging" method on any given `filterFn` allows the filter function to transform/sanitize/format the filter value before it is passed to the filter function. The table applies it once per filter (not once per row), so it is also the right place for expensive preparation work.

- `filterFn.resolveDataValue` - This optional "hanging" method normalizes each row's value before it is compared against the filter value. It is honored by every filter function built with the `constructFilterFn` helper, which includes all built-in filter functions.

- `filterFn.autoRemove` - This optional "hanging" method on any given `filterFn` is passed a filter value and expected to return `true` if the filter value should be removed from the filter state. e.g. Some boolean-style filters may want to remove the filter value from the table state if the filter value is set to `false`. When provided, this test is authoritative: values it keeps stay in filter state even when they are empty strings, which the default heuristic would otherwise remove. An `undefined` filter value always clears the filter regardless.

The `constructFilterFn` helper builds a filter function from a value-level comparator plus those optional resolvers:

```ts
const startsWithFilterFn = constructFilterFn({
  // compare the (resolved) row value against the (resolved) filter value
  filter: (dataValue, filterValue) =>
    Boolean(dataValue?.startsWith(filterValue)),
  // normalize the filter value once, before any rows are tested
  resolveFilterValue: (value) => String(value).toLowerCase().trim(),
  // normalize each row's value before it reaches the comparator
  resolveDataValue: (value) => String(value ?? '').toLowerCase(),
  // remove the filter value from filter state if it is falsy (empty string in this case)
  autoRemove: (value) => !value,
})
```

Keeping the comparison in `filter` and the normalization in the resolvers pays off when you need a variant of an existing filter function. The definition is attached to the returned function, so you can spread any filter function built with `constructFilterFn` and override only what differs. For example, a version of `includesString` that also ignores diacritics (so a search for "eric" matches "Éric"):

```ts
const normalize = (value: unknown) =>
  String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')

const includesStringIgnoreDiacritics = constructFilterFn({
  ...filterFn_includesString, // reuse the comparator and autoRemove behavior
  resolveFilterValue: normalize,
  resolveDataValue: normalize,
})
```

Register the variant by name in the `filterFns` registry or pass it directly to the `filterFn` column option, just like any other custom filter function.

> [!NOTE]
> The table applies `resolveFilterValue` once per filter before any rows are tested. If you ever call a filter function directly (outside of a table), resolve the filter value yourself: `myFilterFn(row, columnId, myFilterFn.resolveFilterValue?.(rawValue) ?? rawValue)`.

### Customize Column Filtering

There are a lot of table and column options that you can use to further customize the column filtering behavior.

#### Disable Column Filtering

By default, column filtering is enabled for all columns. You can disable the column filtering for all columns or for specific columns by using the `enableColumnFilters` table option or the `enableColumnFilter` column option. You can also turn off both column and global filtering by setting the `enableFilters` table option to `false`.

Disabling column filtering for a column will cause the `column.getCanFilter` API to return `false` for that column.

```ts
const columns = [
  {
    header: () => 'Id',
    accessorKey: 'id',
    enableColumnFilter: false, // disable column filtering for this column
  },
  //...
]
//...
readonly table = injectTable(() => ({
  features,
  columns,
  data,
  enableColumnFilters: false, // disable column filtering for all columns
}))
```

#### Filtering Sub-Rows (Expanding)

There are a few additional table options to customize the behavior of column filtering when using features like expanding, grouping, and aggregation.

##### Filter From Leaf Rows

By default, filtering is done from parent rows down, so if a parent row is filtered out, all of its child sub-rows will be filtered out as well. Depending on your use-case, this may be the desired behavior if you only want the user to be searching through the top-level rows, and not the sub-rows. This is also the most performant option.

However, if you want to allow sub-rows to be filtered and searched through, regardless of whether the parent row is filtered out, you can set the `filterFromLeafRows` table option to `true`. Setting this option to `true` will cause filtering to be done from leaf rows up, which means parent rows will be included so long as one of their child or grand-child rows is also included.

```ts
const features = tableFeatures({
  columnFilteringFeature,
  rowExpandingFeature,
  filteredRowModel: createFilteredRowModel(),
  expandedRowModel: createExpandedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
})

readonly table = injectTable(() => ({
  features,
  columns,
  data,
  filterFromLeafRows: true, // filter and search through sub-rows
}))
```

##### Max Leaf Row Filter Depth

By default, filtering is done for all rows in a tree, no matter if they are root level parent rows or the child leaf rows of a parent row. Setting the `maxLeafRowFilterDepth` table option to `0` will cause filtering to only be applied to the root level parent rows, with all sub-rows remaining unfiltered. Similarly, setting this option to `1` will cause filtering to only be applied to child leaf rows 1 level deep, and so on.

Use `maxLeafRowFilterDepth: 0` if you want to preserve a parent row's sub-rows from being filtered out while the parent row is passing the filter.

```ts
const features = tableFeatures({
  columnFilteringFeature,
  rowExpandingFeature,
  filteredRowModel: createFilteredRowModel(),
  expandedRowModel: createExpandedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
})

readonly table = injectTable(() => ({
  features,
  columns,
  data,
  maxLeafRowFilterDepth: 0, // only filter root level parent rows out
}))
```

### Column Filter APIs

There are a lot of Column and Table APIs that you can use to interact with the column filter state and hook up to your UI components. Here is a list of the available APIs and their most common use-cases:

- `table.setColumnFilters` - Overwrite the entire column filter state with a new state.
- `table.resetColumnFilters` - Useful for a "clear all/reset filters" button.

- **`column.getFilterValue`** - Useful for getting the default initial filter value for an input, or even directly providing the filter value to a filter input.
- **`column.setFilterValue`** - Useful for connecting filter inputs to their `onChange` or `onBlur` handlers.

- `column.getCanFilter` - Useful for disabling/enabling filter inputs.
- `column.getIsFiltered` - Useful for displaying a visual indicator that a column is currently being filtered.
- `column.getFilterIndex` - Useful for displaying in what order the current filter is being applied.

- `column.getAutoFilterFn` - Used internally to find the default filter function for a column if none is specified.
- `column.getFilterFn` - Useful for displaying which filter mode or function is currently being used.

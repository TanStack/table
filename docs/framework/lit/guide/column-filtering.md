---
title: Column Filtering (Lit) Guide
---

## Examples

Want to skip to the implementation? Check out these Lit examples:

- [Column Filters](../examples/filters)
- [Faceted Filters](../examples/filters-faceted)
- [Fuzzy Search](../examples/filters-fuzzy)

### Lit Setup

```ts
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { TableController, tableFeatures, columnFilteringFeature, createFilteredRowModel, filterFns } from '@tanstack/lit-table'

const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns,
})

@customElement('my-table')
class MyTable extends LitElement {
  @state()
  private data = defaultData

  private tableController = new TableController(this)

  protected render() {
    const table = this.tableController.table({
      features,
      columns,
      data: this.data,
    })

    return html`...`
  }
}
```

## Column Filtering (Lit) Guide

Filtering comes in 2 flavors: Column Filtering and Global Filtering.

This guide will focus on column filtering, which is a filter that is applied to a single column's accessor value.

TanStack table supports both client-side and manual server-side filtering. This guide will go over how to implement and customize both, and help you decide which one is best for your use-case.

### Client-Side vs Server-Side Filtering

If you have a large dataset, you may not want to load all of that data into the client's browser in order to filter it. In this case, you will most likely want to implement server-side filtering, sorting, pagination, etc. 

However, as also discussed in the [Pagination Guide](./pagination#should-you-use-client-side-pagination), a lot of developers underestimate how many rows can be loaded client-side without a performance hit. The TanStack table examples are often tested to handle up to 100,000 rows or more with decent performance for client-side filtering, sorting, pagination, and grouping. This doesn't necessarily mean that your app will be able to handle that many rows, but if your table is only going to have a few thousand rows at most, you might be able to take advantage of the client-side filtering, sorting, pagination, and grouping that TanStack table provides.

> TanStack Table can handle thousands of client-side rows with good performance. Don't rule out client-side filtering, pagination, sorting, etc. without some thought first.

Every use-case is different and will depend on the complexity of the table, how many columns you have, how large every piece of data is, etc. The main bottlenecks to pay attention to are:

1. Can your server query all of the data in a reasonable amount of time (and cost)?
2. What is the total size of the fetch? (This might not scale as badly as you think if you don't have many columns.)
3. Is the client's browser using too much memory if all of the data is loaded at once?

If you're not sure, you can always start with client-side filtering and pagination and then switch to server-side strategies in the future as your data grows.

### Manual Server-Side Filtering

If you have decided that you need to implement server-side filtering instead of using the built-in client-side filtering, here's how you do that.

No `filteredRowModel` is needed for manual server-side filtering. Instead, the `data` that you pass to the table should already be filtered. However, if you have registered a `filteredRowModel` in your `features`, you can tell the table to skip it by setting the `manualFiltering` option to `true`.

```ts
const features = tableFeatures({ columnFilteringFeature })

const table = this.tableController.table({
  features,
  data: this.data,
  columns,
  manualFiltering: true,
})
```

> **Note:** When using manual filtering, many of the options that are discussed in the rest of this guide will have no effect. When `manualFiltering` is set to `true`, the table instance will not apply any filtering logic to the rows that are passed to it. Instead, it will assume that the rows are already filtered and will use the `data` that you pass to it as-is.

### Client-Side Filtering

If you are using the built-in client-side filtering features, add the `columnFilteringFeature` to your features and the `filteredRowModel` factory as a slot on `tableFeatures`. Import `createFilteredRowModel` and `filterFns` from TanStack Table:

```ts
import {
  TableController,
  tableFeatures,
  columnFilteringFeature,
  createFilteredRowModel,
  filterFns,
} from '@tanstack/lit-table'

const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns,
})

const table = this.tableController.table({
  features,
  data: this.data,
  columns,
})
```

### Column Filter State

Whether or not you use client-side or server-side filtering, you can take advantage of the built-in column filter state management that TanStack Table provides. There are many table and column APIs to mutate and interact with the filter state and retrieving the column filter state.

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

For reads in your `render` method, use `table.state.columnFilters` (the state selected by the selector passed to `tableController.table`). The `TableController` subscribes the host to `table.store`, so the host updates whenever the column filter state changes. In event handlers or other non-render code, you can read the current snapshot with `table.atoms.columnFilters.get()`.

```ts
const table = this.tableController.table(
  {
    features,
    columns,
    data: this.data,
    //...
  },
  (state) => ({ columnFilters: state.columnFilters }),
)

table.state.columnFilters // selected state read in render
table.atoms.columnFilters.get() // snapshot read in event handlers
```

However, if you need access to the column filter state outside of the table, you can "control" the column filter state like down below.

### Controlled Column Filter State

If you need easy access to the column filter state in other parts of your application, you can own the column filter state slice yourself. The recommended way in v9 is an external atom passed through the `atoms` table option. Atoms preserve fine-grained subscriptions, and the filter values can be read or subscribed to from any module (such as in a query key for server-side filtering) without going through the component that owns the table.

```ts
import { createAtom } from '@tanstack/store'
import type { ColumnFiltersState } from '@tanstack/lit-table'

// create a stable atom at module scope (or in a shared store module)
const columnFiltersAtom = createAtom<ColumnFiltersState>([]) // can set initial column filter state here

// inside your element's render method
const table = this.tableController.table({
  features,
  columns,
  data: this.data,
  //...
  atoms: {
    columnFilters: columnFiltersAtom, // table filter APIs now update columnFiltersAtom
  },
})

const columnFilters = columnFiltersAtom.get() // read the atom wherever you need the value
```

Alternatively, the v8-style `state.columnFilters` plus `onColumnFiltersChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
@state()
private columnFilters: ColumnFiltersState = []
//...
const table = this.tableController.table({
  features,
  columns,
  data: this.data,
  //...
  state: {
    columnFilters: this.columnFilters,
  },
  onColumnFiltersChange: (updater) => {
    this.columnFilters = typeof updater === 'function' ? updater(this.columnFilters) : updater
  },
})
```

#### Initial Column Filter State

If you do not need to control the column filter state in your own state management or scope, but you still want to set an initial column filter state, you can use the `initialState` table option instead of `state`.

```ts
const table = this.tableController.table({
  features,
  columns,
  data: this.data,
  //...
  initialState: {
    columnFilters: [
      {
        id: 'name',
        value: 'John', // filter the name column by 'John' by default
      },
    ],
  },
})
```

> **NOTE**: Do not use both `initialState.columnFilters` and `state.columnFilters` at the same time, as the controlled `state.columnFilters` value will override the `initialState.columnFilters`.

### FilterFns

Each column can have its own unique filtering logic. Choose from any of the filter functions that are provided by TanStack Table, or create your own.

By default there are 12 built-in filter functions to choose from:

- `includesString` - Case-insensitive string inclusion
- `includesStringSensitive` - Case-sensitive string inclusion
- `equalsString` - Case-insensitive string equality
- `equals` - Strict equality `===`
- `weakEquals` - Weak equality `==`
- `arrIncludes` - The row's array (or string) value includes at least one of the filter values
- `arrIncludesAll` - The row's array value includes every filter value
- `arrIncludesSome` - The row's array value includes at least one of the filter values
- `arrHas` - The row's scalar value equals at least one of the filter values
- `inNumberRange` - Inclusive `[min, max]` number range (endpoints normalized and swapped if reversed)
- `between` - Exclusive min/max range (blank endpoints are open-ended)
- `betweenInclusive` - Inclusive min/max range (blank endpoints are open-ended)

You can also define your own custom filter functions, either inline as the `filterFn` column option, or by name in the `filterFns` slot on `tableFeatures`.

#### Custom Filter Functions

> **Note:** These filter functions only run during client-side filtering.

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
    filterFn: 'myCustomFilterFn', // reference a custom filter function registered in the filterFns slot
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
    ...filterFns,
    myCustomFilterFn: (row, columnId, filterValue) => {
      return // true or false based on your custom logic
    },
    startsWith: startsWithFilterFn, // defined elsewhere
  },
})

const table = this.tableController.table({
  features,
  columns,
  data: this.data,
})
```

> **TypeScript Note:** String references like `filterFn: 'myCustomFilterFn'` are automatically typed when the function is registered in the `filterFns` slot on `tableFeatures`. The registry slot replaces the old `declare module` augmentation approach. Alternatively, skip the registry entirely by passing the function directly to the `filterFn` column option. See the [Fuzzy Search example](../examples/filters-fuzzy) for a complete registration example.

##### Customize Filter Function Behavior

You can attach a few other properties to filter functions to customize their behavior:

- `filterFn.resolveFilterValue` - This optional "hanging" method on any given `filterFn` allows the filter function to transform/sanitize/format the filter value before it is passed to the filter function.

- `filterFn.autoRemove` - This optional "hanging" method on any given `filterFn` is passed a filter value and expected to return `true` if the filter value should be removed from the filter state. eg. Some boolean-style filters may want to remove the filter value from the table state if the filter value is set to `false`.

```ts
const startsWithFilterFn = <TFeatures extends TableFeatures, TData extends RowData>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: string, // resolveFilterValue below transforms the raw value to a string
) =>
  row
    .getValue<number | string>(columnId)
    .toString()
    .toLowerCase()
    .trim()
    .startsWith(filterValue); // toString, toLowerCase, and trim the filter value in `resolveFilterValue`

// remove the filter value from filter state if it is falsy (empty string in this case)
startsWithFilterFn.autoRemove = (val: any) => !val; 

// transform/sanitize/format the filter value before it is passed to the filter function
startsWithFilterFn.resolveFilterValue = (val: any) => val.toString().toLowerCase().trim(); 
```

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
const table = this.tableController.table({
  features,
  columns,
  data: this.data,
  enableColumnFilters: false, // disable column filtering for all columns
})
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
  filterFns,
})

const table = this.tableController.table({
  features,
  columns,
  data: this.data,
  filterFromLeafRows: true, // filter and search through sub-rows
})
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
  filterFns,
})

const table = this.tableController.table({
  features,
  columns,
  data: this.data,
  maxLeafRowFilterDepth: 0, // only filter root level parent rows out
})
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

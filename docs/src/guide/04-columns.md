---
name: Columns
id: columns
---

## Column Definitions

Column definitions are the single most important part of building a table. They are responsible for:

- Building the underlying data model that will be used for everything including sorting, filtering, grouping, etc.
- Formatting the data model into what will be displayed in the table
- Creating [header groups, headers and footers](../headers)
- Creating columns for display-only purposes, eg. action buttons, checkboxes, expanders, sparklines, etc.

### Creating Column Definitions

There are 3 ways of creating a column definition:

- `table.createDisplayColumn()`
  - Display columns do _not_ have a data model which means they cannot be sorted, filtered, etc, but they can be used to display arbitrary content in the table, eg. a row actions button, checkbox, expander, etc.
- `table.createGroup()`
  - Group columns do _not_ have a data model so they too cannot be sorted, filterd, etc, and are used to group other columns together. It's common to define a header or footer for a column group.
- `table.createDataColumn()`
  - Data columns have an underlying data model which means they can be sorted, filtered, grouped, etc.

Columns can be created using the `table` factory you receive from `createTable()`. You'll probably want to set up the types correctly for your columns as well.

Here's an example of creating some of these different column types:

```tsx
import { createTable } from '@tanstack/react-table'

// Define you row shape
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

// Let your table know about your row shape
const table = createTable().setRowType<Person>()

// Make some columns!
const defaultColumns = [
  table.createDisplayColumn({
    id: 'actions',
    cell: props => <RowActions row={props.row}>
  }),
  table.createGroup({
    header: 'Name',
    footer: props => props.column.id,
    columns: [
      table.createDataColumn('firstName', {
        cell: info => info.getValue(),
        footer: props => props.column.id,
      }),
      table.createDataColumn(row => row.lastName, {
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
      }),
    ],
  }),
  table.createGroup({
    header: 'Info',
    footer: props => props.column.id,
    columns: [
      table.createDataColumn('age', {
        header: () => 'Age',
        footer: props => props.column.id,
      }),
      table.createGroup({
        header: 'More Info',
        columns: [
          table.createDataColumn('visits', {
            header: () => <span>Visits</span>,
            footer: props => props.column.id,
          }),
          table.createDataColumn('status', {
            header: 'Status',
            footer: props => props.column.id,
          }),
          table.createDataColumn('progress', {
            header: 'Profile Progress',
            footer: props => props.column.id,
          }),
        ],
      }),
    ],
  }),
]
```

### Creating Data Columns

Data columns are unique in that they must be configured to extract primitive values each item in your `data` array.

There are 2 ways to do this:

- If your items are `objects`, using an object-key that corresponds to the value you want to extract.
- If your items are nested arrays`, using an array index that corresponds to the value you want to extract.
- Using an accessor function that returns the value you want to extract.

#### Object Keys

If each of your items is an object with the following shape:

```tsx
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}
```

You could extract the `firstName` value like so:

```tsx
table.createDataColumn('firstName')
```

#### Array Indices

If each of your items is an array with the following shape:

```tsx
type Sales = [Date, number]
```

You could extract the `number` value like so:

```tsx
table.createDataColumn(1)
```

#### Accessor Functions

If each of your items is an object with the following shape:

```tsx
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}
```

You could extract a computed full-name value like so:

```tsx
table.createDataColumn(row => `${row.firstName} ${row.lastName}`, {
  id: 'fullName',
})
```

> 🧠 Remember, the accessed value is what is used to sort, filter, etc. so you'll want to make sure your accessor function returns a primitive value that can be manipulated in a meaningful way. If you return a non-primitive value like an object or array, you will need the appropriate filter/sort/grouping functions to manipulate them, or even supply your own! 😬

#### Unique Column IDs

Columns are uniquely identified with 3 strategies:

- If defining a data column with an object key or array index, the same will be used to uniquely identify the column.
- If defining a data column with an accessor function
  - The columns `id` property will be used to uniquely identify the column OR
  - If a primitive `string` header is supplied, that header string will be used to uniquely identify the column

> 🧠 An easy way to remember: I you define a column with an accessor function, either provide a string header or provide a unique `id` property.

### Column Formatting & Rendering

By default, columns cells will display their data model value as a string. You can override this behavior by providing custom rendering implementations. Each implementation is provided relevant information about the cell, header or footer and returns something your framework [adapter](../guides/adapters.md) can render eg. JSX/Components/strings/etc. This will depend on which adapter you are using.

There are a couple of formatters available to you:

- `cell`: Used for formatting cells.
- `aggregatedCell`: Used for formatting cells when aggregated.
- `header`: Used for formatting headers.
- `footer`: Used for formatting footers.

#### Cell Formatting

You can provide a custom cell formatter by passing a function to the `cell` property and using the `props.getValue()` function to access your cell's value:

```tsx
table.createDataColumn('firstName', {
  cell: props => props.getValue().toUpperCase(),
})
```

Cell formatters are also provided the `row` and `instance` objects, allowing you to customize the cell formatting beyond just the cell value. The example below provides `firstName` as the accessor, but also displays a prefixed user ID located on the original row object:

```tsx
table.createDataColumn('firstName', {
  cell: props => {
    return <span>{`${props.row.original.id} - ${props.getValue()}`}</span>
  },
})
```

#### Aggregated Cell Formatting

For more info on aggregated cells, see [grouping](../grouping.md).

#### Header & Footer Formatting

Headers and footer do not have acceess to row data, but still use the same concepts for displaying custom content.

If all you need is a

</>
</>
</>
</>

## Column Definition Options

## Column API

## Table Options

#### `data`

```tsx
data: TGenerics['Row'][]
```

The data for the table to display. This is array should match the type you provided to `table.setRowType<...>`, but in theiry could be an array of anything. It's common for each item in the array ito be an object of key/values but this is not required. Columns can access this data via string/index or a functional accessor to return anything they want.

When the `data` option changes reference (compared via `Object.is`), the table will reprocess the data. Any other data processing that relies on the core data model (such as grouping, sorting, filtering, etc) will also be reprocessed.

> 🧠 Make sure your `data` option is only changing when you want the table to reprocess. Providing an inline `[]` or construction the data array as a new object every time you want to render the table will result in a _lot_ of unnecessary re-processing. This can easily go unnoticed in smaller tables, but you will likely notice it in larger tables.

#### `initialState`

```tsx
initialState?: Partial<
  VisibilityTableState &
  ColumnOrderTableState &
  ColumnPinningTableState &
  FiltersTableState &
  SortingTableState &
  ExpandedTableState &
  GroupingTableState &
  ColumnSizingTableState &
  PaginationTableState &
  RowSelectionTableState
>
```

Use this option to optionally pass initial state to the table. This state will be used when resetting various table states either automatically by the table (eg. `options.autoResetPagination`) or via functions like `instance.resetRowSelection()`. Most reset function allow you optionally pass a flag to reset to a blank/default state instead of the initial state.

> 🧠 Table state will not be reset when this object changes, which also means that the initial state object does not need to be stable.

#### `autoResetAll`

```tsx
autoResetAll?: boolean
```

Set this option to override any of the `autoReset...` feature options.

#### `meta`

```tsx
meta?: TGenerics['TableMeta']
```

After calling `table.setTableMetaType<{...your meta type...}>()`, you can pass a meta object of the same type to this table option. This meta object will remain available anywhere the table `instance` is available.

> 🧠 Think of this option as an arbitrary "context" for your table. This is a great way to pass arbitrary data or functions to your table instance without having to pass it to every thing the table touches. A good example is passing a locale object to your table to use for formatting dates, numbers, etc or even a function that can be used to updated editable data like in the [editable-data example](../examples/editable-data.mdx).

#### `state`

```tsx
state?: Partial<
  VisibilityTableState &
  ColumnOrderTableState &
  ColumnPinningTableState &
  FiltersTableState &
  SortingTableState &
  ExpandedTableState &
  GroupingTableState &
  ColumnSizingTableState &
  PaginationTableState &
  RowSelectionTableState
>
```

The `state` option can be used to optionally _control_ part or all of the table state. The state you pass here will merge with and overwrite the internal automatically-managed state to produce the final state for the table. You can also listen to state changes via the `onStateChange` option.

#### `onStateChange`

```tsx
onStateChange: (updater: Updater<TableState>) => void
```

The `onStateChange` option can be used to optionally listen to state changes within the table. If you provide this options, you will be responsible for controlling and updating the table state yourself. You can provide the state back to the table with the `state` option.

#### `debugAll`

> ⚠️ Debugging is only available in development mode.

```tsx
debugAll?: boolean
```

Set this option to true to output all debugging information to the console.

#### `debugTable`

> ⚠️ Debugging is only available in development mode.

```tsx
debugTable?: boolean
```

Set this option to true to output table debugging information to the console.

#### `debugHeaders`

> ⚠️ Debugging is only available in development mode.

```tsx
debugHeaders?: boolean
```

Set this option to true to output header debugging information to the console.

#### `debugColumns`

> ⚠️ Debugging is only available in development mode.

```tsx
debugColumns?: boolean
```

Set this option to true to output column debugging information to the console.

#### `debugRows`

> ⚠️ Debugging is only available in development mode.

```tsx
debugRows?: boolean
```

Set this option to true to output row debugging information to the console.

#### `render`

> ⚠️ This option is only necessary if you are implementing a table adapter. See [Guides - Adapters](../guides/adapters) for more information.

```tsx
type render = <TProps>(
  template: Renderable<TGenerics, TProps>,
  props: TProps
) => string | null | TGenerics['Rendered']
```

The `render` option provides a renderer implementation for the table. This implementation is used to turn a table's various column header and cell templates into a result that is supported by the user's framework.

#### `mergeOptions`

> ⚠️ This option is only necessary if you are implementing a table adapter. See [Guides - Adapters](../guides/adapters) for more information.

```tsx
type mergeOptions = <T>(defaultOptions: T, options: Partial<T>) => T
```

This option is used to optionally implement the merging of table options. Some framework like solid-js use proxies to track reactivity and usage, so merging reactive objects needs to be handled carefully. This option inverts control of this process to the adapter.

## Table Instance API

#### `initialState`

```tsx
initialState: VisibilityTableState &
  ColumnOrderTableState &
  ColumnPinningTableState &
  FiltersTableState &
  SortingTableState &
  ExpandedTableState &
  GroupingTableState &
  ColumnSizingTableState &
  PaginationTableState &
  RowSelectionTableState
```

This is the resolved initial state of the table.

#### `reset`

```tsx
reset: () => void
```

Call this function to reset the table state to the initial state.

#### `getState`

```tsx
getState: () => TableState
```

Call this function to get the table's current state. It's recommended to use this function and its state, especially when managing the table state manually. It is the exact same state used internally by the table for every feature and function it provides.

> 🧠 The state returned by this function is the shallow-merged result of the automatically-managed internal table-state and any manually-managed state passed via `options.state`.

#### `setState`

```tsx
setState: (updater: Updater<TableState>) => void
```

Call this function to update the table state. It's recommended you pass an updater function in the form of `(prevState) => newState` to update the state, but a direct object can also be passed.

> 🧠 If `options.onStateChange` is provided, it will be triggered by this function with the new state.

#### `options`

```tsx
options: TableOptions<TGenerics>
```

A read-only reference to the table instance's current options.

> ⚠️ This property is generally used internally or by adapters. It can be updated by passing new options to your table instance. This is different per adapter. For adapters themselves, table options must be updated via the `setOptions` function.

#### `setOptions`

```tsx
setOptions: (newOptions: Updater<TableOptions<TGenerics>>) => void
```

> ⚠️ This function is generally used by adapters to update the table options. It can be used to update the table options directly, but it is generally not recommended to bypass your adapters strategy for updating table options.

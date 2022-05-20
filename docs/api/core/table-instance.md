---
title: TableInstance
---

## `useTableInstance` / `createTableInstance`

```tsx
type useTableInstance = <TGenerics extends ReactTableGenerics>(
  table: Table<TGenerics>,
  options: UseTableInstanceOptions<TGenerics>
) => TableInstance<TGenerics>
```

These hooks / functions used to create a table instance. Which one you use depends on which framework adapter you are using.

## Options

These are **core** options and API properties for the table instance. More options and API properties are available for other [table features](../guide/09-features.md).

### `data`

```tsx
data: TGenerics['Row'][]
```

The data for the table to display. This is array should match the type you provided to `table.setRowType<...>`, but in theiry could be an array of anything. It's common for each item in the array ito be an object of key/values but this is not required. Columns can access this data via string/index or a functional accessor to return anything they want.

When the `data` option changes reference (compared via `Object.is`), the table will reprocess the data. Any other data processing that relies on the core data model (such as grouping, sorting, filtering, etc) will also be reprocessed.

> 🧠 Make sure your `data` option is only changing when you want the table to reprocess. Providing an inline `[]` or construction the data array as a new object every time you want to render the table will result in a _lot_ of unnecessary re-processing. This can easily go unnoticed in smaller tables, but you will likely notice it in larger tables.

### `columns`

```tsx
type columns = ColumnDef<TGenerics>[]
```

The array of column defs to use for the table instance.

### `defaultColumn`

```tsx
defaultColumn?: Partial<ColumnDef<TGenerics>>[]
```

Default column options to use for all column defs supplied to the table instance. This is useful for providing default cell/header/footer renderers, sorting/filtering/grouping options, etc.

### `initialState`

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

### `autoResetAll`

```tsx
autoResetAll?: boolean
```

Set this option to override any of the `autoReset...` feature options.

### `meta`

```tsx
meta?: TGenerics['TableMeta']
```

After calling `table.setTableMetaType<{...your meta type...}>()`, you can pass a meta object of the same type to this table option. This meta object will remain available anywhere the table `instance` is available.

> 🧠 Think of this option as an arbitrary "context" for your table. This is a great way to pass arbitrary data or functions to your table instance without having to pass it to every thing the table touches. A good example is passing a locale object to your table to use for formatting dates, numbers, etc or even a function that can be used to updated editable data like in the [editable-data example](../examples/react/editable-data.mdx).

### `state`

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

### `onStateChange`

```tsx
onStateChange: (updater: Updater<TableState>) => void
```

The `onStateChange` option can be used to optionally listen to state changes within the table. If you provide this options, you will be responsible for controlling and updating the table state yourself. You can provide the state back to the table with the `state` option.

### `debugAll`

> ⚠️ Debugging is only available in development mode.

```tsx
debugAll?: boolean
```

Set this option to true to output all debugging information to the console.

### `debugTable`

> ⚠️ Debugging is only available in development mode.

```tsx
debugTable?: boolean
```

Set this option to true to output table debugging information to the console.

### `debugHeaders`

> ⚠️ Debugging is only available in development mode.

```tsx
debugHeaders?: boolean
```

Set this option to true to output header debugging information to the console.

### `debugColumns`

> ⚠️ Debugging is only available in development mode.

```tsx
debugColumns?: boolean
```

Set this option to true to output column debugging information to the console.

### `debugRows`

> ⚠️ Debugging is only available in development mode.

```tsx
debugRows?: boolean
```

Set this option to true to output row debugging information to the console.

### `render`

> ⚠️ This option is only necessary if you are implementing a table adapter. See [Guides - Adapters](../guides/adapters) for more information.

```tsx
type render = <TProps>(
  template: Renderable<TGenerics, TProps>,
  props: TProps
) => string | null | TGenerics['Rendered']
```

The `render` option provides a renderer implementation for the table. This implementation is used to turn a table's various column header and cell templates into a result that is supported by the user's framework.

### `mergeOptions`

> ⚠️ This option is only necessary if you are implementing a table adapter. See [Guides - Adapters](../guides/adapters) for more information.

```tsx
type mergeOptions = <T>(defaultOptions: T, options: Partial<T>) => T
```

This option is used to optionally implement the merging of table options. Some framework like solid-js use proxies to track reactivity and usage, so merging reactive objects needs to be handled carefully. This option inverts control of this process to the adapter.

### `getCoreRowModel`

```tsx
getCoreRowModel: (
  instance: TableInstance<TGenerics>
) => () => RowModel<TGenerics>
```

This required option is a factory for a function that computes and returns the core row model for the table. It is called **once** per table instance and should return a **new function** which will calculate and return the row model for the table.

A default implementation is provided via any table adapter's `{ getCoreRowModel }` export.

### `getSubRows`

```tsx
getSubRows?: (
  originalRow: TGenerics['Row'],
  index: number
) => undefined | TGenerics['Row'][]
```

This optional function is used to access the sub rows for any given row. If you are using nested rows, you will need to use this function to return the sub rows object (or undefined) from the row.

### `getRowId`

```tsx
getRowId?: (
  originalRow: TGenerics['Row'],
  index: number,
  parent?: Row<TGenerics>
) => string
```

This optional function is used to derive a unique ID for any given row. If not provided the rows index is used (nested rows join together with `.` using their grandparents' index eg. `index.index.index`). If you need to identify individual rows that are originating from any server-side operations, it's suggested you use this function to return an ID that makes sense regardless of network IO/amiguity eg. a userId, taskId, database ID field, etc.

### `columns`

```tsx
type columns = ColumnDef<TGenerics>[]
```

The column defs to use for this table instance. See the [Table API](../table.md) for more information on creating column definitions.

### `defaultColumn`

```tsx
defaultColumn?: Partial<ColumnDef<TGenerics>>
```

An optional, partial column default column definition. All column definitions passed to `options.columns` are merged with this default column definition to produce the final column definitions.

## Table Instance

These properties and methods are available on the table instance object:

### `initialState`

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

### `reset`

```tsx
reset: () => void
```

Call this function to reset the table state to the initial state.

### `getState`

```tsx
getState: () => TableState
```

Call this function to get the table's current state. It's recommended to use this function and its state, especially when managing the table state manually. It is the exact same state used internally by the table for every feature and function it provides.

> 🧠 The state returned by this function is the shallow-merged result of the automatically-managed internal table-state and any manually-managed state passed via `options.state`.

### `setState`

```tsx
setState: (updater: Updater<TableState>) => void
```

Call this function to update the table state. It's recommended you pass an updater function in the form of `(prevState) => newState` to update the state, but a direct object can also be passed.

> 🧠 If `options.onStateChange` is provided, it will be triggered by this function with the new state.

### `options`

```tsx
options: TableOptions<TGenerics>
```

A read-only reference to the table instance's current options.

> ⚠️ This property is generally used internally or by adapters. It can be updated by passing new options to your table instance. This is different per adapter. For adapters themselves, table options must be updated via the `setOptions` function.

### `setOptions`

```tsx
setOptions: (newOptions: Updater<TableOptions<TGenerics>>) => void
```

> ⚠️ This function is generally used by adapters to update the table options. It can be used to update the table options directly, but it is generally not recommended to bypass your adapters strategy for updating table options.

### `getCoreRowModel`

```tsx
getCoreRowModel: () => {
  rows: Row<TGenerics>[],
  flatRows: Row<TGenerics>[],
  rowsById: Record<string, Row<TGenerics>>,
}
```

Returns the core row model before any processing has been applied.

### `getRowModel`

```tsx
getRowModel: () => {
  rows: Row<TGenerics>[],
  flatRows: Row<TGenerics>[],
  rowsById: Record<string, Row<TGenerics>>,
}
```

Returns the final model after all processing from other used features has been applied.

### `getAllColumns`

```tsx
type getAllColumns = () => Column<TGenerics>[]
```

Returns all columns in the table in their normalized and nested hierarchy, mirrored from the column defs passed to the table instance.

### `getAllFlatColumns`

```tsx
type getAllFlatColumns = () => Column<TGenerics>[]
```

Returns all columns in the table flattened to a single level. This includes parent column objects throughout the hierarchy.

### `getAllLeafColumns`

```tsx
type getAllLeafColumns = () => Column<TGenerics>[]
```

Returns all leaf-node columns in the table flattened to a single level. This does not include parent columns.

### `getColumn`

```tsx
type getColumn = (id: string) => Column<TGenerics>
```

Returns a single column by its ID.

### `getHeaderGroups`

```tsx
type getHeaderGroups = () => HeaderGroup<TGenerics>[]
```

Returns the header groups for the table.

### `getFooterGroups`

```tsx
type getFooterGroups = () => HeaderGroup<TGenerics>[]
```

Returns the footer groups for the table.

### `getFlatHeaders`

```tsx
type getFlatHeaders = () => Header<TGenerics>[]
```

Returns a flattened array of Header objects for the table, including parent headers.

### `getLeafHeaders`

```tsx
type getLeafHeaders = () => Header<TGenerics>[]
```

Returns a flattened array of leaf-node Header objects for the table.

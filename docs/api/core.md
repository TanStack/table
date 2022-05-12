---
name: Core
route: /api/core
menu: API
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents**

- [Table Options](#table-options)
  - [`data`](#data)
  - [`initialState`](#initialstate)
  - [`autoResetAll`](#autoresetall)
  - [`meta`](#meta)
  - [`state`](#state)
  - [`onStateChange`](#onstatechange)
  - [`debugAll`](#debugall)
  - [`debugTable`](#debugtable)
  - [`debugHeaders`](#debugheaders)
  - [`debugColumns`](#debugcolumns)
  - [`debugRows`](#debugrows)
  - [`render`](#render)
  - [`mergeOptions`](#mergeoptions)
- [Table Instance API](#table-instance-api)
  - [`initialState`](#initialstate-1)
  - [`reset`](#reset)
  - [`getState`](#getstate)
  - [`setState`](#setstate)
  - [`options`](#options)
  - [`setOptions`](#setoptions)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

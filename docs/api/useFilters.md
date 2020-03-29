---
name: useFilters
route: /api/useFilters
menu: API
---

# `useFilters`

- Plugin Hook
- Optional

`useFilters` is the hook that implements **row filtering** and can even be used in conjunction with `useGlobalFilter`. It's also important to note that this hook can be used either **before or after** `useGlobalFilter`, depending on the performance characteristics you want to code for.

### Table Options

The following options are supported via the main options object passed to `useTable(options)`

- `initialState.filters: Array<Object<id: String, value: any>>`
  - Must be **memoized**
  - An array of objects containing columnId's and their corresponding filter values. This information is stored in state since the table is allowed to manipulate the filter through user interaction.
- `manualFilters: Bool`
  - Enables filter detection functionality, but does not automatically perform row filtering.
  - Turn this on if you wish to implement your own row filter outside of the table (eg. server-side or manual row grouping/nesting)
- `disableFilters: Bool`
  - Disables filtering for every column in the entire table.
- `defaultCanFilter: Bool`
  - Optional
  - Defaults to `false`
  - If set to `true`, all columns will be filterable, regardless if they have a valid `accessor`
- `filterTypes: Object<filterKey: filterType>`
  - Must be **memoized**
  - Allows overriding or adding additional filter types for columns to use. If a column's filter type isn't found on this object, it will default to using the built-in filter types.
  - For more information on filter types, see Filtering
- `autoResetFilters: Boolean`
  - Defaults to `true`
  - When `true`, the `filters` state will automatically reset if any of the following conditions are met:
    - `data` is changed
  - To disable, set to `false`
  - For more information see the FAQ ["How do I stop my table state from automatically resetting when my data changes?"](../faq#how-do-i-stop-my-table-state-from-automatically-resetting-when-my-data-changes)

### Column Options

The following options are supported on any `Column` object passed to the `columns` options in `useTable()`

- `Filter: Function | React.Component => JSX`
  - **Required**
  - Receives the table instance and column model as props
  - Must return valid JSX
  - This function (or component) is used to render this column's filter UI, eg.
- `disableFilters: Bool`
  - Optional
  - If set to `true`, will disable filtering for this column
- `defaultCanFilter: Bool`
  - Optional
  - Defaults to `false`
  - If set to `true`, this column will be filterable, regardless if it has a valid `accessor`
- `filter: String | Function`
  - Optional
  - Defaults to `text`
  - The resolved function from the this string/function will be used to filter the this column's data.
    - If a `string` is passed, the function with that name located on either the custom `filterTypes` option or the built-in filtering types object will be used. If
    - If a `function` is passed, it will be used directly.
  - For more information on filter types, see Filtering
  - If a **function** is passed, it must be **memoized**

### Instance Properties

The following values are provided to the table `instance`:

- `rows: Array<Row>`
  - An array of **filtered** rows.
- `preFilteredRows: Array<Row>`
  - The array of rows **used right before filtering**.
  - Among many other use-cases, these rows are directly useful for building option lists in filters, since the resulting filtered `rows` do not contain every possible option.
- `setFilter: Function(columnId, filterValue) => void`
  - An instance-level function used to update the filter value for a specific column.
- `setAllFilters: Function(filtersObjectArray) => void`
  - An instance-level function used to update the values for **all** filters on the table, all at once.
  - filtersObjectArray is an array of objects with id and value keys. Example: `[{ id: 'columnAccessor', value: 'valueToFilter' }]`
  - Note: You must call setAllFilters with an array, even if that array is empty. eg: `setAllFilters([])`.

### Column Properties

The following properties are available on every `Column` object returned by the table instance.

- `canFilter: Bool`
  - Denotes whether a column is filterable or not depending on if it has a valid accessor/data model or is manually disabled via an option.
- `setFilter: Function(filterValue) => void`
  - A column-level function used to update the filter value for this column
- `filterValue: any`
  - The current filter value for this column, resolved from the table state's `filters` object
- `preFilteredRows: Array<row>`
  - The array of rows that were originally passed to this columns filter **before** they were filtered.
  - This array of rows can be useful if building faceted filter options.
- `filteredRows: Array<row>`
  - The resulting array of rows received from this columns filter **after** they were filtered.
  - This array of rows can be useful if building faceted filter options.

### Example

- [Source](https://github.com/tannerlinsley/react-table/tree/master/examples/filtering)
- [Open in CodeSandbox](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/filtering)

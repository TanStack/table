# `useFilters`

- Plugin Hook
- Optional

`useFilters` is the hook that implements **row filtering** - filtering based upon the data in _specific_ columns. It can be used in conjunction with `useGlobalFilter`, which involves filtering rows based upon data in _any_ column in a given row. It is important to note that this hook can be used either **before or after** `useGlobalFilter`, depending on the performance characteristics you want to code for.

### Table Options

The following options are supported via the main options object passed to `useTable(options)`

- `initialState.filters: Array<Object<id: String, value: any>>`
  - Must be **memoized**
  - An array of objects, each having a column `id` and a corresponding filter `value`. This information is stored in state since the table is allowed to manipulate the filter through user interaction.
- `manualFilters: Bool`
  - Enables filter detection functionality, but does not automatically perform row filtering.
  - Turn this on if you wish to implement your own row filter outside of the table (e.g. server-side or manual row grouping/nesting)
- `disableFilters: Bool`
  - Disables filtering for every column in the entire table.
- `defaultCanFilter: Bool`
  - Optional
  - Defaults to `false`
  - If set to `true`, all columns will be filterable, regardless if they have a valid `accessor`
- `filterTypes: Object<filterKey: filterType>`
  - Must be **memoized**
  - Allows overriding or adding additional filter types for columns to use. If a column's `filter` type isn't found on this object, the column will default to using the built-in filter types.
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
  - This function (or component) is used to render this column's filter UI
- `disableFilters: Bool`
  - Optional
  - If set to `true`, filtering for this column will be disabled
- `defaultCanFilter: Bool`
  - Optional
  - Defaults to `false`
  - If set to `true`, this column will be filterable, regardless if it has a valid `accessor`
- `filter: String | Function(rows: Array<Row>, columnIds: Array<ColumnId: String>, filterValue) => Rows[]`
  - Optional
  - Defaults to `text`
  - The resolved function from this option will be used to filter this column's data.
    - If a `string` is passed, the function with that name will be used from either the custom `filterTypes` table option (if specified) or from the built-in filtering types object.
    - If a `function` is passed:
      - It must be **memoized**
      - It will be called directly with an array of `rows` to filter, an array of `columnIds` (being a single-element array with the column ID being filtered), and `filterValue`, being the current value of the filter being applied
      - It must return an `Array` of rows, being the remaining rows that have _not_ been filtered out

### Instance Properties

The following values are provided to the table `instance`:

- `state.filters: Array<Object<id: String, value: any>>`
  - The current `filters` values located on the state object. This is an array of objects, each having a column `id` and its current corresponding filter `value`. Example: `[{ id: 'name', value: 'Jane'}, { id: 'age', value: 21 }]`
- `rows: Array<Row>`
  - An array of **filtered** rows.
- `preFilteredRows: Array<Row>`
  - The array of rows **used right before filtering**.
  - Among many other use-cases, these rows are directly useful for displaying the total number of available rows and building option lists in filters, since the resulting filtered `rows` do not contain every possible option.
- `setFilter: Function(columnId, filterValue) => void`
  - An instance-level function used to update the filter value for a specific column.
- `setAllFilters: Function(filtersObjectArray) => void`
  - An instance-level function used to update the values for **all** filters on the table, all at once.
  - `filtersObjectArray` is an array of objects with `id` and `value` keys. Example: `[{ id: 'columnAccessor', value: 'valueToFilter' }]`
  - **Note:** You must call `setAllFilters` with an array, even if that array is empty. Example: `setAllFilters([])`

### Column Properties

The following properties are available on every `Column` object returned by the table instance:

- `canFilter: Bool`
  - Denotes whether a column is filterable or not depending on if it has a valid accessor/data model or is manually disabled via an option.
- `setFilter: Function(filterValue) => void`
  - A column-level function used to update the filter value for this column
- `filterValue: any`
  - The current filter value for this column, resolved from the table state's `filters` object
- `preFilteredRows: Array<row>`
  - The array of rows that were originally passed to this column's filter **before** filtering took place.
  - This array of rows can be useful if building faceted filter options.
- `filteredRows: Array<row>`
  - The resulting array of rows received from this column's filter **after** filtering took place.
  - This array of rows can be useful if building faceted filter options.

### Example

- [Source](https://github.com/tannerlinsley/react-table/tree/master/examples/filtering)
- [Open in CodeSandbox](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/filtering)

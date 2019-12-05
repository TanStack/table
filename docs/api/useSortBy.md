# `useSortBy`

- Plugin Hook
- Optional

`useSortBy` is the hook that implements **row sorting**. It also support multi-sort (keyboard required).

- Multi-sort is enabled by default
- To sort the table via UI, attach the props generated from each column's `getSortByToggleProps()`, then click any of those elements.
- To multi-sort the table via UI, hold `shift` while clicking on any of those same elements that have the props from `getSortByToggleProps()` attached.
- To programmatically sort (or multi-sort) any column, use the `toggleSortBy` method located on the instance or each individual column.

### Table Options

The following options are supported via the main options object passed to `useTable(options)`

- `state.sortBy: Array<Object<id: columnId, desc: Bool>>`
  - Must be **memoized**
  - An array of sorting objects. If there is more than one object in the array, multi-sorting will be enabled. Each sorting object should contain an `id` key with the corresponding column ID to sort by. An optional `desc` key may be set to true or false to indicated ascending or descending sorting for that column. This information is stored in state since the table is allowed to manipulate the filter through user interaction.
- `initialState.sortBy`
  - Identical to the `state.sortBy` option above
- `manualSorting: Bool`
  - Enables sorting detection functionality, but does not automatically perform row sorting. Turn this on if you wish to implement your own sorting outside of the table (eg. server-side or manual row grouping/nesting)
- `disableSortBy: Bool`
  - Disables sorting for every column in the entire table.
- `defaultCanSort: Bool`
  - Optional
  - Defaults to `false`
  - If set to `true`, all columns will be sortable, regardless if they have a valid `accessor`
- `disableMultiSort: Bool`
  - Disables multi-sorting for the entire table.
- `isMultiSortEvent: Function`
  - Allows to override default multisort behaviour(i.e. multisort applies when shift key is pressed), if this function is provided then returned boolean value from this function will make decision whether newly applied sort action will be considered as multisort or not.
  - Receives `event` as argument.
- `maxMultiSortColCount: Number`
  - Limit on max number of columns for multisort, e.g. if set to 3, and suppose table is sorted by `[A, B, C]` and then clicking `D` for sorting should result in table sorted by `[B, C , D]`
- `disableSortRemove: Bool`
  - If true, the un-sorted state will not be available to columns once they have been sorted.
- `disableMultiRemove: Bool`
  - If true, the un-sorted state will not be available to multi-sorted columns.
- `orderByFn: Function`
  - Must be **memoized**
  - Defaults to the built-in default orderBy function
  - This function is responsible for composing multiple sorting functions together for multi-sorting, and also handles both the directional sorting and stable-sorting tie breaking. Rarely would you want to override this function unless you have a very advanced use-case that requires it.
- `sortTypes: Object<sortKey: sortType>`
  - Must be **memoized**
  - Allows overriding or adding additional sort types for columns to use. If a column's sort type isn't found on this object, it will default to using the built-in sort types.
  - For more information on sort types, see Sorting
- `getResetSortByDeps: Function(instance) => [...useEffectDependencies]`
  - Optional
  - Defaults to `false`
  - If set, the dependencies returned from this function will be used to determine when the effect to reset the `sortBy` state is fired.
  - To disable, set to `false`
  - For more information see the FAQ ["How do I stop my table state from automatically resetting when my data changes?"](./faq#how-do-i-stop-my-table-state-from-automatically-resetting-when-my-data-changes)

### Column Options

The following options are supported on any `Column` object passed to the `columns` options in `useTable()`

- `defaultCanSort: Bool`
  - Optional
  - Defaults to `false`
  - If set to `true`, this column will be sortable, regardless if it has a valid `accessor`
- `disableSortBy: Bool`
  - Optional
  - Defaults to `false`
  - If set to `true`, the sorting for this column will be disabled
- `sortDescFirst: Bool`
  - Optional
  - Defaults to `false`
  - If set to `true`, the first sort direction for this column will be descending instead of ascending
- `sortInverted: Bool`
  - Optional
  - Defaults to `false`
  - If set to `true`, the underlying sorting direction will be inverted, but the UI will not.
  - This may be useful in situations where positive and negative connotation is inverted, eg. a Golfing score where a lower score is considered more positive than a higher one.
- `sortType: String | Function`
  - Used to compare 2 rows of data and order them correctly.
  - If a **function** is passed, it must be **memoized**
  - String options: `basic`, `datetime`, `alphanumeric`. Defaults to `alphanumeric`.
  - The resolved function from the this string/function will be used to sort the this column's data.
    - If a `string` is passed, the function with that name located on either the custom `sortTypes` option or the built-in sorting types object will be used.
    - If a `function` is passed, it will be used.
  - For more information on sort types, see Sorting

### Instance Properties

The following values are provided to the table `instance`:

- `rows: Array<Row>`
  - An array of **sorted** rows.
- `preSortedRows: Array<Row>`
  - The array of rows that were originally sorted.
- `toggleSortBy: Function(ColumnId: String, descending: Bool, isMulti: Bool) => void`
  - This function can be used to programmatically toggle the sorting for any specific column

### Column Properties

The following properties are available on every `Column` object returned by the table instance.

- `canSort: Bool`
  - Denotes whether a column is sortable or not depending on if it has a valid accessor/data model or is manually disabled via an option.
- `toggleSortBy: Function(descending, multi) => void`
  - This function can be used to programmatically toggle the sorting for this column.
  - This function is similar to the `instance`-level `toggleSortBy`, however, passing a columnId is not required since it is located on a `Column` object already.
- `getSortByToggleProps: Function(props) => props`
  - **Required**
  - This function is used to resolve any props needed for this column's UI that is responsible for toggling the sort direction when the user clicks it.
  - You can use the `getSortByToggleProps` hook to extend its functionality.
  - Custom props may be passed. **NOTE: Custom props may override built-in sortBy props, so be careful!**
- `clearSorting: Function() => void`
  - This function can be used to programmatically clear the sorting for this column.
- `isSorted: Boolean`
  - Denotes whether this column is currently being sorted
- `sortedIndex: Int`
  - If the column is currently sorted, this integer will be the index in the `sortBy` array from state that corresponds to this column.
  - If this column is not sorted, the index will always be `-1`
- `isSortedDesc: Bool`
  - If the column is currently sorted, this denotes whether the column's sort direction is descending or not.
  - If `true`, the column is sorted `descending`
  - If `false`, the column is sorted `ascending`
  - If `undefined`, the column is not currently being sorted.

### Example

- [Source](https://github.com/tannerlinsley/react-table/tree/master/examples/sorting)
- [Open in CodeSandbox](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/sorting)

# `useFilters`

- Plugin Hook
- Optional

`useFilters` is the hook that implements **row filtering**.

### Table Options

The following options are supported via the main options object passed to `useTable(options)`

- `state.filters: Object<columnId: filterValue>`
  - Must be **memoized**
  - An object of columnId's and their corresponding filter values. This information is stored in state since the table is allowed to manipulate the filter through user interaction.
- `initialState.filters`
  - Identical to the `state.filters` option above
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
- `getResetFiltersDeps: Function(instance) => [...useEffectDependencies]`
  - Optional
  - Defaults to `false`
  - If set, the dependencies returned from this function will be used to determine when the effect to reset the `filters` state is fired.
  - To disable, set to `false`
  - For more information see the FAQ ["How do I stop my table state from automatically resetting when my data changes?"](./faq#how-do-i-stop-my-table-state-from-automatically-resetting-when-my-data-changes)

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
- `setAllFilters: Function(filtersObject) => void`
  - An instance-level function used to update the values for **all** filters on the table, all at once.

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

# `useGlobalFilter`

- Plugin Hook
- Optional

`useGlobalFilter` is the hook that implements **global row filtering** – in other words, filtering based upon data that may be in _any_ column in a given row. This is often useful as a free-text search across all columns simultaneously. It can be used in conjunction with `useFilters`, which involves filtering based upon data in _specific_ columns. It is important to note that this hook can be used either **before or after** `useFilters`, depending on the performance characteristics you want to code for.

### Table Options

The following options are supported via the main options object passed to `useTable(options)`

- `initialState.globalFilter: any`
  - Must be **memoized**
  - The initial value of the global filter. This information is stored in state since the table is allowed to manipulate the filter through user interaction.
- `globalFilter: String | Function(rows: Array<Row>, columnIds: Array<ColumnId: String>, globalFilterValue) => Rows[]`
  - Optional
  - Defaults to `text`
  - The resolved function from this option will be used to filter the table's data.
    - If a `string` is passed, the function with that name will be used from either the custom `filterTypes` table option (if specified) or used from the built-in filtering types object.
    - If a `function` is passed:
      - It must be **memoized**
      - It will be called directly with an array of `rows` to filter, an array of `columnIds` (being the column IDs that global filtering is being applied to), and `globalFilterValue`, being the current value of the global filter
      - It must return an `Array` of rows, being the remaining rows that have _not_ been filtered out according to the `globalFilterValue` specified
- `manualGlobalFilter: Bool`
  - Enables filter detection functionality, but does not automatically perform row filtering.
  - Turn this on if you wish to implement your own row filter outside of the table (e.g. server-side or manual row grouping/nesting)
- `disableGlobalFilter: Bool`
  - Disables global filtering for every column in the entire table.
- `filterTypes: Object<filterKey: filterType>`
  - Must be **memoized**
  - Allows overriding or adding additional filter types for the table to use. If the `globalFilter` type isn't found on this object, the table will default to using the built-in filter types.
- `autoResetGlobalFilter: Boolean`
  - Defaults to `true`
  - When `true`, the `globalFilter` state will automatically reset if any of the following conditions are met:
    - `data` is changed
  - To disable, set to `false`
  - For more information see the FAQ ["How do I stop my table state from automatically resetting when my data changes?"](../faq#how-do-i-stop-my-table-state-from-automatically-resetting-when-my-data-changes)

### Column Options

The following options are supported on any `Column` object passed to the `columns` option in `useTable()`:

- `disableGlobalFilter: Bool`
  - Optional
  - If set to `true`, global filtering will be disabled for this column

### Instance Properties

The following values are provided to the table `instance`:

- `state.globalFilter: String`
  - The current `globalFilter` value, located on the state object.
- `rows: Array<Row>`
  - An array of **filtered** rows.
- `preGlobalFilteredRows: Array<Row>`
  - The array of rows **used right before filtering**.
  - Among many other use-cases, these rows are directly useful for displaying the total number of available rows and building option lists in filters, since the resulting filtered `rows` do not contain every possible option.
- `setGlobalFilter: Function(filterValue) => void`
  - An instance-level function used to update the global filter value.

### Example

- [Source](https://github.com/tannerlinsley/react-table/tree/master/examples/filtering)
- [Open in CodeSandbox](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/filtering)

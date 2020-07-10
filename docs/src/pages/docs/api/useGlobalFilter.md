# `useGlobalFilter`

- Plugin Hook
- Optional

`useGlobalFilter` is the hook that implements **global row filtering** and can even be used in conjunction with `useFilters`. It's also important to note that this hook can be used either **before or after** `useFilters`, depending on the performance characteristics you want to code for.

### Table Options

The following options are supported via the main options object passed to `useTable(options)`

- `initialState.globalFilter: any`
  - Must be **memoized**
  - An array of objects containing columnId's and their corresponding filter values. This information is stored in state since the table is allowed to manipulate the filter through user interaction.
- `globalFilter: String | Function`
  - Optional
  - Defaults to `text`
  - The resolved function from the this string/function will be used to filter the table's data.
    - If a `string` is passed, the function with that name located on either the custom `filterTypes` option or the built-in filtering types object will be used. If
    - If a `function` is passed, it will be used directly.
  - For more information on filter types, see Filtering
  - If a **function** is passed, it must be **memoized**
- `manualGlobalFilter: Bool`
  - Enables filter detection functionality, but does not automatically perform row filtering.
  - Turn this on if you wish to implement your own row filter outside of the table (eg. server-side or manual row grouping/nesting)
- `disableGlobalFilter: Bool`
  - Disables global filtering for every column in the entire table.
- `filterTypes: Object<filterKey: filterType>`
  - Must be **memoized**
  - Allows overriding or adding additional filter types for the table to use. If the globalFilter type isn't found on this object, it will default to using the built-in filter types.
  - For more information on filter types, see Filtering
- `autoResetGlobalFilter: Boolean`
  - Defaults to `true`
  - When `true`, the `globalFilter` state will automatically reset if any of the following conditions are met:
    - `data` is changed
  - To disable, set to `false`
  - For more information see the FAQ ["How do I stop my table state from automatically resetting when my data changes?"](../faq.md#how-do-i-stop-my-table-state-from-automatically-resetting-when-my-data-changes)

### Column Options

The following options are supported on any `Column` object passed to the `columns` option in `useTable()`

- `disableGlobalFilter: Bool`
  - Optional
  - If set to `true`, will disable global filtering for this column

### Instance Properties

The following values are provided to the table `instance`:

- `rows: Array<Row>`
  - An array of **filtered** rows.
- `preGlobalFilteredRows: Array<Row>`
  - The array of rows **used right before filtering**.
  - Among many other use-cases, these rows are directly useful for building option lists in filters, since the resulting filtered `rows` do not contain every possible option.
- `setGlobalFilter: Function(filterValue) => void`
  - An instance-level function used to update the global filter value.

### Example

- [Source](https://github.com/tannerlinsley/react-table/tree/master/examples/filtering)
- [Open in CodeSandbox](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/filtering)

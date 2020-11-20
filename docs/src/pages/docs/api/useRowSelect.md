# `useRowSelect`

- Plugin Hook
- Optional

`useRowSelect` is the hook that implements **basic row selection**. For more information on row selection, see Row Selection

### Table Options

The following options are supported via the main options object passed to `useTable(options)`

- `initialState.selectedRowIds: Object<rowId: Boolean>`
  - Optional
  - Defaults to `{}`
  - If a row's ID is set to `true` in this object, it will have a selected state.
- `manualRowSelectedKey: String`
  - Optional
  - Defaults to `isSelected`
  - If this key is found on the **original** data row, and it is true, this row will be manually selected
- `autoResetSelectedRows: Boolean`
  - Defaults to `true`
  - When `true`, the `selectedRowIds` state will automatically reset if any of the following conditions are met:
    - `data` is changed
  - To disable, set to `false`
  - For more information see the FAQ ["How do I stop my table state from automatically resetting when my data changes?"](../faq#how-do-i-stop-my-table-state-from-automatically-resetting-when-my-data-changes)

### Instance Properties

The following values are provided to the table `instance`:

- `toggleRowSelected: Function(rowPath: String, ?set: Bool) => void`
  - Use this function to toggle a row's selected state.
  - Optionally pass `true` or `false` to set it to that state
- `toggleAllRowsSelected: Function(?set: Bool) => void`
  - Use this function to toggle all rows as selected or not
  - Optionally pass `true` or `false` to set all rows to that state
- `toggleAllPageRowsSelected: Function(?set: Bool) => void`
  - Use this function to toggle all of the current page's rows as selected or not
  - Optionally pass `true` or `false` to set all rows to that state
- `getToggleAllPageRowsSelectedProps: Function(props) => props`
  - Use this function to get the props needed for a **select all checkbox (current page only)**.
  - Props:
    - `onChange: Function()`
    - `style.cursor: 'pointer'`
    - `checked: Bool`
    - `indeterminate: Bool`
    - `title: 'Toggle All Rows Selected'`
- `getToggleAllRowsSelectedProps: Function(props) => props`
  - Use this function to get the props needed for a **select all checkbox**.
  - Props:
    - `onChange: Function()`
    - `style.cursor: 'pointer'`
    - `checked: Bool`
    - `indeterminate: Bool`
    - `title: 'Toggle All Rows Selected'`
- `isAllRowsSelected: Bool`
  - Will be `true` if all rows are selected.
  - If at least one row is not selected, will be `false`
- `selectedFlatRows: Array<Row>`
  - The flat array of rows that are currently selected

### Row Properties

The following additional properties are available on every **prepared** `row` object returned by the table instance.

- `isSelected: Bool`
  - Will be `true` if the row is currently selected
- `isSomeSelected: Bool`
  - Will be `true` if the row has subRows and at least one of them is currently selected
- `toggleRowSelected: Function(?set)`
  - Use this function to toggle this row's selected state.
  - Optionally pass `true` or `false` to set it to that state
- `getToggleRowSelectedProps: Function(props) => props`
  - Use this function to get the props needed for a **select row checkbox**.
  - Props:
    - `onChange: Function()`
    - `style.cursor: 'pointer'`
    - `checked: Bool`
    - `title: 'Toggle Row Selected'`

### Example

#### Select All Checks All Rows

- [Source](https://github.com/tannerlinsley/react-table/tree/master/examples/row-selection)
- [Open in CodeSandbox](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/row-selection)

#### Select All Checks Current Page's Rows

- [Source](https://github.com/tannerlinsley/react-table/tree/master/examples/row-selection-and-pagination)
- [Open in CodeSandbox](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/row-selection-and-pagination)

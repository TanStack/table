# `useRowState`

- Plugin Hook
- Optional

`useRowState` is a plugin hook that implements **basic state management for _prepared_ rows and their cells**.

### Table Options

The following options are supported via the main options object passed to `useTable(options)`

- `initialState.rowState: Object<RowPathKey:Object<any, cellState: {columnId: Object}>>`
  - Optional
  - Defaults to `{}`
  - If a row's ID is found in this array, it will have the state of the value corresponding to that key.
  - Individual row states can contain anything, but they also contain a `cellState` key, which provides cell-level state based on column ID's to every
    **prepared** cell in the table.
- `initialRowStateAccessor: Function(row) => Object<any>`
  - Optional
  - Defaults to: `row => ({})`
  - This function should return the initial state for a row.
  - If this function is defined, it will be passed a `Row` object, from which you can return a value to use as the initial state, eg. `row => row.original.initialState`
- `initialCellStateAccessor: Function(cell) => Object<any>`
  - **Optional**
  - Defaults to: `cell => ({})`
  - This function should return the initial state for a cell.
  - If this function is defined, it will be passed a `Cell` object, from which you can return a value to use as the initial state, eg. `cell => cell.row.original.initialCellState[cell.column.id]`
- `autoResetRowState: Boolean`
  - Defaults to `true`
  - When `true`, the `rowState` state will automatically reset if any of the following conditions are met:
    - `data` is changed
  - To disable, set to `false`
  - For more information see the FAQ ["How do I stop my table state from automatically resetting when my data changes?"](../faq#how-do-i-stop-my-table-state-from-automatically-resetting-when-my-data-changes)

### Instance Properties

The following values are provided to the table `instance`:

- `setRowState: Function(rowPath: Array<string>, updater: Function | Any) => void`
  - Use this function to programmatically update the state of a row.
  - `updater` can be a function or value. If a `function` is passed, it will receive the current value and expect a new one to be returned.
- `setCellState: Function(rowPath: Array<string>, columnId: String, updater: Function | Any) => void`
  - Use this function to programmatically update the cell of a row.
  - `updater` can be a function or value. If a `function` is passed, it will receive the current value and expect a new one to be returned.

### Row Properties

The following additional properties are available on every **prepared** `row` object returned by the table instance.

- `state: Object`
  - This is the state object for each row, pre-mapped to the row from the table state's `rowState` object via `rowState[row.id]`
  - May also contain a `cellState` key/value pair, which is used to provide individual cell states to this row's cells
- `setState: Function(updater: Function | any)`
  - Use this function to programmatically update the state of a row.
  - `updater` can be a function or value. If a `function` is passed, it will receive the current value and expect a new one to be returned.

### Cell Properties

The following additional properties are available on every `Cell` object returned in an array of `cells` on every row object.

- `state: Object`
  - This is the state object for each cell, pre-mapped to the cell from the table state's `rowState` object via `rowState[row.id].cellState[columnId]`
- `setState: Function(updater: Function | any)`
  - Use this function to programmatically update the state of a cell.
  - `updater` can be a function or value. If a `function` is passed, it will receive the current value and expect a new one to be returned.

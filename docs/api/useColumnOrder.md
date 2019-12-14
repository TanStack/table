# `useColumnOrder`

- Plugin Hook
- Optional

`useColumnOrder` is a plugin hook that implements **basic column reordering**. As columns are reordered, their header groups are reverse-engineered so as to never have orphaned header groups.

### Table Options

The following options are supported via the main options object passed to `useTable(options)`

- `initialState.columnOrder: Array<ColumnId>`
  - Optional
  - Defaults to `[]`
  - Any column ID's not represented in this array will be naturally ordered based on their position in the original table's `column` structure

### Instance Properties

The following values are provided to the table `instance`:

- `setColumnOrder: Function(updater: Function | Array<ColumnId>) => void`

  - Use this function to programmatically update the columnOrder.
  - `updater` can be a function or value. If a `function` is passed, it will receive the current value and expect a new one to be returned.

- [Source](https://github.com/tannerlinsley/react-table/tree/master/examples/column-ordering)
- [Open in CodeSandbox](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/column-ordering)

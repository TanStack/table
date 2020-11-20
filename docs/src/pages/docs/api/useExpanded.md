# `useExpanded`

- Plugin Hook
- Optional

`useExpanded` is the hook that implements **row expanding**. It is most often used with `useGroupBy` to expand grouped rows or on its own with nested `subRows` in tree-like `data` sets, but is not limited to these use-cases. It supports expanding rows both via internal table state and also via a hard-coded key on the raw row model.

### Table Options

The following options are supported via the main options object passed to `useTable(options)`

- `initialState.expanded: Object<rowId: String, expanded: Bool>`
  - Optional
  - Must be **memoized**
  - An `object` of expanded row IDs with boolean property values.
  - If a row's id is set to true in this object, that row will have an expanded state. For example, if `{ '3': true }` was passed as the `expanded` state, by default the **4th row in the original data array** would be expanded, since it would have that ID
  - For nested expansion, you can **use nested IDs like `1.3`** to expand sub rows. For example, if `{ '3': true, '3.5': true }` was passed as the `expanded` state, then the **the 4th row would be expanded, along with the 6th subRow of the 4th row as well**.
  - This information is stored in state since the table is allowed to manipulate the filter through user interaction.
- `getSubRows: Function(row, relativeIndex) => Rows[]`
  - Optional
  - See the [useTable hook](./useTable#table-options) for more details
- `manualExpandedKey: String`
  - Optional
  - Defaults to `expanded`
  - This string is used as the key to detect manual expanded state on any given row. For example, if a raw data row like `{ name: 'Tanner Linsley', friends: [...], expanded: true}` was detected, it would always be expanded, regardless of state.
- `expandSubRows: Bool`
  - Optional
  - Defaults to `true`
  - If set to `true`, expanded rows are rendered along with normal rows.
  - If set to `false`, expanded rows will only be available through their parent row. This could be useful if you are implementing a custom expanded row view.
- `autoResetExpanded: Boolean`
  - Defaults to `true`
  - When `true`, the `expanded` state will automatically reset if any of the following conditions are met:
    - `data` is changed
  - To disable, set to `false`
  - For more information see the FAQ ["How do I stop my table state from automatically resetting when my data changes?"](../faq#how-do-i-stop-my-table-state-from-automatically-resetting-when-my-data-changes)

### Instance Properties

The following properties are available on the table instance returned from `useTable`

- `rows: Array<Row>`
  - An array of **expanded** rows.
- `toggleRowExpanded: Function(rowId, isExpanded?)`
  - A function to toggle whether a row is expanded or not. The `isExpanded` boolean is optional, otherwise it will be a true toggle action
- `toggleAllRowsExpanded: Function(isExpanded?)`
  - A function to toggle whether all of the rows in the table are expanded or not. The `isExpanded` boolean is optional, otherwise it will be a true toggle action
- `isAllRowsExpanded`
- `getToggleAllRowsExpandedProps: Function(userProps) => props`
  - A prop getter function that returns all necessary props for an element to be clicked and toggle all of the rows expanded or not.

### Row Properties

The following additional properties are available on every `row` object returned by the table instance.

- `isExpanded: Bool`
  - If `true`, this row is in an expanded state.
- `toggleRowExpanded: Function(?isExpanded: Bool) => void`
  - This function will toggle the expanded state of a row between `true` and `false` or, if an `isExpanded` boolean is passed to the function, it will be set as the new `isExpanded` value.
  - Rows with a hard-coded `manualExpandedKey` (defaults to `expanded`) set to `true` are not affected by this function or the internal expanded state.

### Example

- [Source](https://github.com/tannerlinsley/react-table/tree/master/examples/expanding)
- [Open in CodeSandbox](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/expanding)

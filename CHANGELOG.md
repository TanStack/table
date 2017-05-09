## 6.0.0

- Updated/New Renderers:
  - `Cell` - deprecates and replaces `render`
  - `Header` - deprecates and replaces `header`
  - `Footer` - deprecates and replaces `footer`
  - `Aggregated` - Custom renderer for aggregated cells
  - `Pivot` - Custom renderer for Pivoted Cells (utilizes `Expander` and `PivotValue`)
  - `PivotValue` - Custom renderer for Pivot cell values
  - `Expander` - Custom renderer for Pivot cell Expander
  - `Filter`- Custom renderer for Filters
- Pivot Columns are now visibly separate and sorted/filtered independently.
- Custom sorting methods per instance via `sortMethod` and per column via `column.sortMethod`
- Prevent transitions while column resizing for a smoother resize effect.
- You may now use `column.resizable` to restrict or allow resizing for specific columns
- Disable text selection while resizing columns.
- All callbacks can now be utilized without needing to hoist and manage the piece of state they export. That is what their prop counterparts are for, so now the corresponding prop is used instead of the callback to detect a "fully controlled" state.
- Callbacks now provide the destination state as the primary parameter(s). This makes hoisting and controlling the state in redux or component state much easier. eg.
  - `onSorting` no longer requires you to build your own toggle logic
  - `onResize` no longer requires you to build your own resize logic
- `onChange` callback is now deprecated in favor of the better labeled `onFetchData` prop, which will always fires when a new data model needs to be fetched (or is build internally).
- `onFilteringChange` has been renamed to `onFilterChange` for simplicity and consistency.


##### Breaking API Changes
* Removed `pivotRender` column option. You can now control how the value is displayed by overriding the `PivotValueComponent` or the individual column's `PivotValue` renderer.
See [Pivoting Options Story](https://react-table.js.org/?selectedKind=2.%20Demos&selectedStory=Pivoting%20Options&full=0&down=1&left=1&panelRight=0&downPanel=kadirahq%2Fstorybook-addon-actions%2Factions-panel) for a reference on how to customize pivot column rendering.

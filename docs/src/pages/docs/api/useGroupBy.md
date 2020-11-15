# `useGroupBy`

- Plugin Hook
- Optional

`useGroupBy` is the hook that implements **row grouping and aggregation**.

- Each column's `getGroupByToggleProps()` function can be used to generate the props needed to make a clickable UI element that will toggle the grouping on or off for a specific column.
- Instance and column-level `toggleGroupBy` functions are also made available for programmatic grouping.

### Table Options

The following options are supported via the main options object passed to `useTable(options)`

- `initialState.groupBy: Array<String>`
  - Must be **memoized**
  - An array of groupBy ID strings, controlling which columns are used to calculate row grouping and aggregation. This information is stored in state since the table is allowed to manipulate the groupBy through user interaction.
- `manualGroupBy: Bool`
  - Enables groupBy detection and functionality, but does not automatically perform row grouping.
  - Turn this on if you wish to implement your own row grouping outside of the table (eg. server-side or manual row grouping/nesting)
- `disableGroupBy: Bool`
  - Disables groupBy for the entire table.
- `aggregations: Object<aggregationKey: aggregationFn>`
  - Must be **memoized**
  - Allows overriding or adding additional aggregation functions for use when grouping/aggregating row values. If an aggregation key isn't found on this object, it will default to using the built-in aggregation functions
- `groupByFn: Function`
  - Must be **memoized**
  - Defaults to `defaultGroupByFn`
  - This function is responsible for grouping rows based on the `state.groupBy` keys provided. It's very rare you would need to customize this function.

### Column Options

The following options are supported on any `Column` object passed to the `columns` options in `useTable()`

- `Aggregated: Function | React.Component => JSX`
  - Optional
  - Defaults to this column's `Cell` formatter
  - Receives the table instance and cell model as props
  - Must return valid JSX
  - This function (or component) formats this column's value when it is being grouped and aggregated, eg. If this column was showing the number of visits for a user to a website and it was currently being grouped to show an **average** of the values, the `Aggregated` function for this column could format that value to `1,000 Avg. Visits`
- `aggregate: String | Function(leafValues, aggregatedValues) => any`
  - Optional
  - Used to aggregate values across rows, eg. `average`-ing the ages of many cells in a table"
  - If a single `String` is passed, it must be the key of either a user defined or predefined `aggregations` function.
  - If a `Function` is passed, this function will receive both the leaf-row values and (if the rows have already been aggregated, the previously aggregated values) to be aggregated into a single value.
  - The function signature for all aggregation functions is `(leafValues, aggregatedValues) => aggregatedValue` where `leafValues` is a flat array containing all leaf rows currently grouped at the aggregation level and `aggregatedValues` is an array containing the aggregated values from the immediate child sub rows. Each has purpose in the types of aggregations they power where optimizations are made for either accuracy or performance.
  - For examples on how an aggregation functions work, see the source code for the built in aggregations in the [src/aggregations.js](../../src/aggregations.js) file.
- `aggregateValue: String | Function(values, row, column) => any`
  - Optional
  - When attempting to group/aggregate non primitive cell values (eg. arrays of items) you will likely need to resolve a stable primitive value like a number or string to use in normal row aggregations. This property can be used to aggregate or simply access the value to be used in aggregations eg. `count`-ing the unique number of items in a cell's array value before `sum`-ing that count across the table.
  - If a single `String` is passed, it must be the key of either a user defined or predefined `aggregations` function.
  - If a `Function` is passed, this function will receive the cell's accessed value, the original `row` object and the `column` associated with the cell
- `disableGroupBy: Boolean`
  - Defaults to `false`
  - If `true`, will disable grouping for this column.

### Instance Properties

The following values are provided to the table `instance`:

- `rows: Array<Row>`
  - An array of **grouped and aggregated** rows.
- `preGroupedRows: Array<Row>`
  - The array of rows originally used to create the grouped rows.
- `toggleGroupBy: Function(columnId: String, ?set: Bool) => void`
  - This function can be used to programmatically set or toggle the groupBy state for a specific column.
- `setGroupBy: Function(columnIds: Array<String>) => void`
  - This function can be used to programmatically set the groupBy state for the table.

### Column Properties

The following properties are available on every `Column` object returned by the table instance.

- `canGroupBy: Boolean`
  - If `true`, this column is able to be grouped.
  - This is resolved from the column having a valid accessor / data model, and not being manually disabled via other `useGroupBy` related options
- `isGrouped: Boolean`
  - If `true`, this column is currently being grouped
- `groupedIndex: Int`
  - If this column is currently being grouped, this integer is the index of this column's ID in the table state's `groupBy` array.
- `toggleGroupBy: Function(?set: Bool) => void`
  - This function can be used to programmatically set or toggle the groupBy state fo this column.
- `getGroupByToggleProps: Function(props) => props`
  - **Required**
  - This function is used to resolve any props needed for this column's UI that is responsible for toggling grouping when the user clicks it.
  - You can use the `getGroupByToggleProps` hook to extend its functionality.
  - Custom props may be passed. **NOTE: Custom props may override built-in sortBy props, so be careful!**

### Row Properties

The following properties are available on every `Row` object returned by the table instance.

- `groupByID: String`
  - The column ID for which this row is being grouped.
  - Will be `undefined` if the row is an original row from `data` and not a materialized one from the grouping.
- `groupByVal: any`
  - If the row is a materialized group row, this will be the grouping value that was used to create it.
- `values: Object`
  - Similar to a regular row, a materialized grouping row also has a `values` object
  - This object contains the **aggregated** values for this row's sub rows
- `subRows: Array<Row>`
  - If the row is a materialized group row, this property is the array of materialized subRows that were grouped inside of this row.
- `leafRows: Array<Row>`
  - If the row is a materialized group row, this property is an array containing all leaf node rows aggregated into this row.
- `depth: Int`
  - If the row is a materialized group row, this is the grouping depth at which this row was created.
- `id: String`
  - The unique ID for this row.
  - This ID is unique across all rows, including sub rows
  - Derived from the `getRowId` function, which defaults to chaining parent IDs and joining with a `.`
  - If a row is a materialized grouping row, it will have an ID in the format of `columnId:groupByVal`.
- `isAggregated: Bool`
  - Will be `true` if the row is an aggregated row

### Cell Properties

The following additional properties are available on every `Cell` object returned in an array of `cells` on every row object.

- `isGrouped: Bool`
  - If `true`, this cell is a grouped cell, meaning it contains a grouping value and should usually display and expander.
- `isPlaceholder: Bool`
  - If `true`, this cell is a repeated value cell, meaning it contains a value that is already being displayed elsewhere (usually by a parent row's cell).
  - Most of the time, this cell is not required to be displayed and can safely be hidden during rendering
- `isAggregated: Bool`
  - If `true`, this cell's value has been aggregated and should probably be rendered with the `Aggregated` cell renderer.

### Example

- [Source](https://github.com/tannerlinsley/react-table/tree/master/examples/grouping)
- [Open in CodeSandbox](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/grouping)

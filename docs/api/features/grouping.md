---
title: Grouping
id: grouping
---

## State

Grouping state is stored on the table instance using the following shape:

```tsx
export type GroupingState = string[]

export type GroupingTableState = {
  grouping: GroupingState
}
```

## Aggregation Functions

The following aggregation functions are built-in to the table core:

- `sum`
  - Sums the values of a group of rows
- `min`
  - Finds the minimum value of a group of rows
- `max`
  - Finds the maximum value of a group of rows
- `extent`
  - Finds the minimum and maximum values of a group of rows
- `mean`
  - Finds the mean/average value of a group of rows
- `median`
  - Finds the median value of a group of rows
- `unique`
  - Finds the unique values of a group of rows
- `uniqueCount`
  - Finds the number of unique values of a group of rows
- `count`
  - Calculates the number of rows in a group

Every grouping function receives:

- A function to retrieve the leaf values of the groups rows
- A function to retrieve the immediate-child values of the groups rows

and should return a value (usually primitive) to build the aggregated row model.

This is the type signature for every aggregation function:

```tsx
export type AggregationFn<TGenerics extends TableGenerics> = (
  getLeafValues: () => TGenerics['Value'][],
  getChildValues: () => TGenerics['Value'][]
) => any
```

#### Using Aggregation Functions

Aggregation functions can be used/referenced/defined by passing the following to `columnDefinition.aggregationFn`:

- A `string` that references a built-in aggregation function
- A `string` that references a custom aggregation functions provided via the `tableOptions.aggregationFns` option
- A function directly provided to the `columnDefinition.aggregationFn` option

The final list of aggregation functions available for the `columnDef.aggregationFn` use the following type:

```tsx
export type AggregationFnOption<TGenerics extends TableGenerics> =
  | 'auto'
  | BuiltInAggregationFn
  | keyof TGenerics['AggregationFns']
  | AggregationFn<TGenerics>
```

## Column Def Options

#### `aggregationFn`

```tsx
aggregationFn?: AggregationFn | keyof TGenerics['AggregationFns'] | keyof BuiltInAggregationFns
```

The aggregation function to use with this column.

Options:

- A `string` referencing a [built-in aggregation function](#aggregation-functions))
- A `string` referencing a custom aggregation function defined on the `aggregationFns` table option
- A [custom aggregation function](#aggregation-functions)

#### `aggregatedCell`

```tsx
aggregatedCell?: Renderable<
  TGenerics,
  {
    instance: TableInstance<TGenerics>
    row: Row<TGenerics>
    column: Column<TGenerics>
    cell: Cell<TGenerics>
    getValue: () => TGenerics['Value']
  }
>
```

The cell to display each row for the column if the cell is an aggregate. If a function is passed, it will be passed a props object with the context of the cell and should return the property type for your adapter (the exact type depends on the adapter being used).

#### `enableGrouping`

```tsx
enableGrouping?: boolean
```

Enables/disables grouping for this column.

## Column API

#### `aggregationFn`

```tsx
aggregationFn?: AggregationFnOption<Overwrite<TGenerics, { Value: any }>>
```

The resolved aggregation function for the column.

#### `getCanGroup`

```tsx
getCanGroup: () => boolean
```

Returns whether or not the column can be grouped.

#### `getIsGrouped`

```tsx
getIsGrouped: () => boolean
```

Returns whether or not the column is currently grouped.

#### `getGroupedIndex`

```tsx
getGroupedIndex: () => number
```

Returns the index of the column in the grouping state.

#### `toggleGrouping`

```tsx
toggleGrouping: () => void
```

Toggles the grouping state of the column.

#### `getToggleGroupingHandler`

```tsx
getToggleGroupingHandler: () => () => void
```

Returns a function that toggles the grouping state of the column. This is useful for passing to the `onClick` prop of a button.

#### `getAutoAggregationFn`

```tsx
getAutoAggregationFn: () => AggregationFn<TGenerics> | undefined
```

Returns the automatically inferred aggregation function for the column.

#### `getAggregationFn`

```tsx
getAggregationFn: () => AggregationFn<TGenerics> | undefined
```

## Row API

#### `groupingColumnId`

```tsx
groupingColumnId?: string
```

If this row is grouped, this is the id of the column that this row is grouped by.

#### `groupingValue`

```tsx
groupingValue?: any
```

If this row is grouped, this is the unique/shared value for the `groupingColumnId` for all of the rows in this group.

#### `getIsGrouped`

```tsx
getIsGrouped: () => boolean
```

Returns whether or not the row is currently grouped.

## Table Options

#### `manualGrouping`

```tsx
manualGrouping?: boolean
```

Enables manual grouping. If this option is set to `true`, the table will not automatically group rows using `getGroupedRowModel()` and instead will expect you to manually group the rows before passing them to the table. This is useful if you are doing server-side grouping and aggregation.

#### `aggregationFns`

```tsx
aggregationFns?: TGenerics['AggregationFns']
```

Normally set ahead of time when using the `createTable()` helper, this option allows you to define custom aggregation functions that can be referenced by their string key.

Example:

```tsx
const table = createTable().setOptions({
  aggregationFns: {
    myCustomAggregationFn: (columnId, leafRows, childRows) => {
      // return the aggregated value
    },
  },
})

const column = table.createDataColumn('key', {
  aggregationFn: 'myCustomAggregationFn',
})
```

#### `onGroupingChange`

```tsx
onGroupingChange?: OnChangeFn<GroupingState>
```

If this function is provided, it will be called when the grouping state changes and you will be expected to manage the state yourself. You can pass the managed state back to the table via the `tableOptions.state.grouping` option.

#### `enableGrouping`

```tsx
enableGrouping?: boolean
```

Enables/disables grouping for all columns.

#### `getGroupedRowModel`

```tsx
getGroupedRowModel?: (instance: TableInstance<TGenerics>) => () => RowModel<TGenerics>
```

Returns the row model after grouping has taken place, but no further.

#### `groupedColumnMode`

```tsx
groupedColumnMode?: false | 'reorder' | 'remove' // default: `reorder`
```

Grouping columns are automatically reordered by default to the start of the columns list. If you would rather remove them or leave them as-is, set the appropriate mode here.

## Table Instance API

#### `setGrouping`

```tsx
setGrouping: (updater: Updater<GroupingState>) => void
```

Sets or updates the `state.grouping` state.

#### `resetGrouping`

```tsx
resetGrouping: (defaultState?: boolean) => void
```

Resets the **grouping** state to `initialState.grouping`, or `true` can be passed to force a default blank state reset to `[]`.

#### `getPreGroupedRowModel`

```tsx
getPreGroupedRowModel: () => RowModel<TGenerics>
```

Returns the row model for the table before any grouping has been applied.

#### `getGroupedRowModel`

```tsx
getGroupedRowModel: () => RowModel<TGenerics>
```

Returns the row model for the table after grouping has been applied.

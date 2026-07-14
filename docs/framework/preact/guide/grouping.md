---
title: Grouping (Preact) Guide
---

## Examples

Want to skip to the implementation? Check out these Preact examples:

- [Grouping](../examples/grouping)

Aggregation is an independent feature. See the core [Aggregation Guide](../../../guide/aggregation) for totals, multiple aggregations, custom definitions, and grouped aggregate values.

### Grouping Setup

Here's how you set up your table to use grouping features. Adding the grouping feature enables the related APIs. Additionally, if using client-side grouping, you also need to set up `groupedRowModel` after its associated feature because row model slots are type-checked.

```tsx
import {
  useTable,
  tableFeatures,
  columnGroupingFeature,
  createGroupedRowModel,
  aggregationFeature,
  aggregationFn_sum,
} from '@tanstack/preact-table'

const features = tableFeatures({
  aggregationFeature,
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(), // if using client-side grouping
  aggregationFns: { sum: aggregationFn_sum },
})

const table = useTable({
  features,
  columns,
  data,
})
```

> **NOTE**: Spreading the entire built-in registry (`aggregationFns: { ...aggregationFns }`) still works, but it puts every built-in aggregation function in your bundle. Registering just the functions you use, or passing a function directly to the `aggregationFn` column option, is recommended.

## Grouping (Preact) Guide

Grouping in TanStack table is a feature that applies to columns and allows you to categorize and organize the table rows based on specific columns. This can be useful in cases where you have a large amount of data and you want to group them together based on certain criteria.

Grouping can also affect column order. There are 3 table features that can reorder columns, which happen in the following order:

1. [Column Pinning](./column-pinning) - If pinning, columns are split into start, center (unpinned), and end pinned columns.
2. Manual [Column Ordering](./column-ordering) - A manually specified column order is applied.
3. **Grouping** - If grouping is enabled, a grouping state is active, and `tableOptions.groupedColumnMode` is set to `'reorder' | 'remove'`, then the grouped columns are reordered to the start of the column flow.

To group rows, add `columnGroupingFeature` and the `groupedRowModel` factory. If grouped rows should also calculate aggregate values, add the independent `aggregationFeature` and register the `aggregationFns` referenced by your columns.

```tsx
import {
  useTable,
  tableFeatures,
  columnGroupingFeature,
  createGroupedRowModel,
  aggregationFeature,
  aggregationFn_sum,
} from '@tanstack/preact-table'

const features = tableFeatures({
  aggregationFeature,
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  aggregationFns: { sum: aggregationFn_sum },
})

const table = useTable({
  features,
  // other options...
})
```

When grouping state is active, the table will add matching rows as subRows to the grouped row. The grouped row will be added to the table rows at the same index as the first matching row. The matching rows will be removed from the table rows.
To allow the user to expand and collapse the grouped rows, you can use the expanding feature.

```tsx
const features = tableFeatures({
  aggregationFeature,
  columnGroupingFeature,
  rowExpandingFeature,
  groupedRowModel: createGroupedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  aggregationFns: { sum: aggregationFn_sum },
})

const table = useTable({
  features,
  // other options...
})
```

### Grouping state

The grouping state is an array of strings, where each string is the ID of a column to group by. The order of the strings in the array determines the order of the grouping. For example, if the grouping state is ['column1', 'column2'], then the table will first group by column1, and then within each group, it will group by column2. You can control the grouping state using the setGrouping function:

```tsx
table.setGrouping(['column1', 'column2'])
```

You can also reset the grouping state to its initial state using the resetGrouping function:

```tsx
table.resetGrouping()
```

By default, when a column is grouped, it is moved to the start of the table. You can control this behavior using the groupedColumnMode option. If you set it to 'reorder', then the grouped columns will be moved to the start of the table. If you set it to 'remove', then the grouped columns will be removed from the table. If you set it to false, then the grouped columns will not be moved or removed.

```tsx
const table = useTable({
  features,
  // other options...
  groupedColumnMode: 'reorder',
})
```

### Aggregations

When both features are registered, grouped rows can aggregate data with the `aggregationFn` column option. It can be a registered name, an inline definition, or an array of aggregations.

```tsx
const column = columnHelper.accessor('key', {
  aggregationFn: 'sum',
})
```

In the above example, the sum aggregation function will be used to aggregate the data in the grouped rows.
By default (`aggregationFn: 'auto'`), numeric columns use the `sum` aggregation function and date columns use the `extent` aggregation function, resolved from the `aggregationFns` registry (a development warning fires if the chosen function is not registered). Other column types are left unaggregated. You can override this behavior by specifying the `aggregationFn` option in the column definition.

There are several built-in aggregation functions that you can use:

- sum - Sums the values in the grouped rows.
- count - Counts the number of rows in the grouped rows.
- min - Finds the minimum value in the grouped rows.
- max - Finds the maximum value in the grouped rows.
- extent - Finds the extent (min and max) of the values in the grouped rows.
- mean - Finds the mean of the values in the grouped rows.
- median - Finds the median of the values in the grouped rows.
- unique - Returns an array of unique values in the grouped rows.
- uniqueCount - Counts the number of unique values in the grouped rows.
- first - Returns the first leaf value in the grouped rows.
- last - Returns the last leaf value in the grouped rows.

#### Custom Aggregations

You can register context-based custom definitions and reference them by name.

```tsx
const myCustomAggregation: AggregationFn<typeof features, MyData> = (
  columnId,
  leafRows,
  childRows,
) => {
  // return the aggregated value
}

const features = tableFeatures({
  aggregationFeature,
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  aggregationFns: {
    sum: aggregationFn_sum,
    myCustomAggregation,
  },
})

const table = useTable({
  features,
  // other options...
})
```

In the above example, myCustomAggregation is a custom aggregation function that takes the column ID, the leaf rows, and the child rows, and returns the aggregated value. You can then use this aggregation function in a column's aggregationFn option:

```tsx
const column = columnHelper.accessor('key', {
  aggregationFn: 'myCustomAggregation',
})
```

> **TypeScript Note:** For `aggregationFn: 'myCustomAggregation'` string references to typecheck, register the function in the `aggregationFns` slot on `tableFeatures` (as shown above). TypeScript infers the registered names from the slot automatically. Alternatively, skip the registry entirely by passing the function directly to the `aggregationFn` column option.

For efficient nested grouping, a definition can also provide `merge({ childResults, childRows })`. See the [Aggregation Guide](../../../guide/aggregation#custom-aggregation-definitions).

### Manual Grouping

If you are doing server-side grouping and aggregation, you can enable manual grouping using the manualGrouping option. When this option is set to true, the table will not automatically group rows using getGroupedRowModel() and instead will expect you to manually group the rows before passing them to the table.

```tsx
const features = tableFeatures({ columnGroupingFeature }) // no groupedRowModel for manual grouping

const table = useTable({
  features,
  // other options...
  manualGrouping: true,
})
```

> **Note:** There are not currently many known easy ways to do server-side grouping with TanStack Table. You will need to do lots of custom cell rendering to make this work.

### Controlled Grouping State

If you need access to the grouping state in other parts of your application, you can own the `grouping` state slice yourself. The recommended way in v9 is an external atom passed through the `atoms` table option. Atoms preserve fine-grained subscriptions, and the grouping value can be read anywhere in your app (such as in a query key for server-side grouping) without forcing the component that owns the table to re-render.

```tsx
import { useCreateAtom, useSelector } from '@tanstack/preact-store'
import type { GroupingState } from '@tanstack/preact-table'

const groupingAtom = useCreateAtom<GroupingState>([])

// subscribe to the atom wherever you need the value
const grouping = useSelector(groupingAtom)

const table = useTable({
  features,
  // other options...
  atoms: {
    grouping: groupingAtom, // grouping APIs now update groupingAtom
  },
})
```

Alternatively, the v8-style `state.grouping` plus `onGroupingChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```tsx
const [grouping, setGrouping] = useState<GroupingState>([])

const table = useTable({
  features,
  // other options...
  state: {
    grouping,
  },
  onGroupingChange: setGrouping,
})
```

### Grouping APIs

Columns expose grouping APIs for toggling grouping and building grouping UI:

```tsx
column.toggleGrouping()
column.getToggleGroupingHandler()
column.getCanGroup()
column.getIsGrouped()
column.getGroupedIndex()
```

Rows expose grouping helpers for grouped row rendering:

```tsx
row.getIsGrouped()
row.getGroupingValue(columnId)
row.groupingColumnId
row.groupingValue
```

Cells expose grouping and placeholder helpers:

```tsx
cell.getIsGrouped()
cell.getIsPlaceholder()
```

`cell.getIsAggregated()`, `column.getAutoAggregationFn()`, `column.getAggregationFns()`, and `column.getAggregationValue()` belong to `aggregationFeature`.

The table instance exposes grouped and pre-grouped row models:

```tsx
table.getGroupedRowModel()
table.getPreGroupedRowModel()
```

Use `table.setGrouping` and `table.resetGrouping` to update the grouping state directly.

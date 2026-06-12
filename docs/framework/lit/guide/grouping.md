---
title: Grouping (Lit) Guide
---

## Examples

Want to skip to the implementation? Check out these Lit examples:

- [Grouping](../examples/grouping)

### Lit Setup

```ts
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { TableController, tableFeatures, columnGroupingFeature, createGroupedRowModel, aggregationFns } from '@tanstack/lit-table'

const features = tableFeatures({
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  aggregationFns,
})

@customElement('my-table')
class MyTable extends LitElement {
  @state()
  private data = defaultData

  private tableController = new TableController(this)

  protected render() {
    const table = this.tableController.table({
      features,
      columns,
      data: this.data,
    })

    return html`...`
  }
}
```

## Grouping (Lit) Guide

Grouping in TanStack table is a feature that applies to columns and allows you to categorize and organize the table rows based on specific columns. This can be useful in cases where you have a large amount of data and you want to group them together based on certain criteria.

Grouping can also affect column order. There are 3 table features that can reorder columns, which happen in the following order:

1. [Column Pinning](./column-pinning) - If pinning, columns are split into left, center (unpinned), and right pinned columns.
2. Manual [Column Ordering](./column-ordering) - A manually specified column order is applied.
3. **Grouping** - If grouping is enabled, a grouping state is active, and `tableOptions.groupedColumnMode` is set to `'reorder' | 'remove'`, then the grouped columns are reordered to the start of the column flow.

To use the grouping feature, add the `columnGroupingFeature` to your features and the `groupedRowModel` to your row models. The grouped row model is responsible for grouping the rows based on the grouping state.

```ts
import {
  TableController,
  tableFeatures,
  columnGroupingFeature,
  createGroupedRowModel,
  aggregationFns,
} from '@tanstack/lit-table'

const features = tableFeatures({
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  aggregationFns,
})

const table = this.tableController.table({
  features,
  // other options...
})
```

When grouping state is active, the table will add matching rows as subRows to the grouped row. The grouped row will be added to the table rows at the same index as the first matching row. The matching rows will be removed from the table rows.
To allow the user to expand and collapse the grouped rows, you can use the expanding feature.

```ts
const features = tableFeatures({
  columnGroupingFeature,
  rowExpandingFeature,
  groupedRowModel: createGroupedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  aggregationFns,
})

const table = this.tableController.table({
  features,
  // other options...
})
```

### Grouping state

The grouping state is an array of strings, where each string is the ID of a column to group by. The order of the strings in the array determines the order of the grouping. For example, if the grouping state is ['column1', 'column2'], then the table will first group by column1, and then within each group, it will group by column2. You can control the grouping state using the setGrouping function:

```ts
table.setGrouping(['column1', 'column2']);
```

You can also reset the grouping state to its initial state using the resetGrouping function:

```ts
table.resetGrouping();
```

By default, when a column is grouped, it is moved to the start of the table. You can control this behavior using the groupedColumnMode option. If you set it to 'reorder', then the grouped columns will be moved to the start of the table. If you set it to 'remove', then the grouped columns will be removed from the table. If you set it to false, then the grouped columns will not be moved or removed.

```ts
const table = this.tableController.table({
  features,
  // other options...
  groupedColumnMode: 'reorder',
})
```

### Aggregations

When rows are grouped, you can aggregate the data in the grouped rows by columns using the `aggregationFn` column option. This is a string that is the name of a built-in aggregation function, or a custom aggregation function registered in the `aggregationFns` slot on `tableFeatures`.

```ts
const column = columnHelper.accessor('key', {
  aggregationFn: 'sum',
})
```

In the above example, the sum aggregation function will be used to aggregate the data in the grouped rows.
By default, numeric columns will use the sum aggregation function, and non-numeric columns will use the count aggregation function. You can override this behavior by specifying the aggregationFn option in the column definition.

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

#### Custom Aggregations

You can define custom aggregation functions in the `aggregationFns` slot on `tableFeatures`. The slot is a record where the keys are the names of the aggregation functions and the values are the aggregation functions themselves. You can then reference these aggregation functions by name in a column's `aggregationFn` option.

```ts
const features = tableFeatures({
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  aggregationFns: {
    ...aggregationFns,
    myCustomAggregation: (columnId, leafRows, childRows) => {
      // return the aggregated value
    },
  },
})

const table = this.tableController.table({
  features,
  // other options...
})
```

In the above example, myCustomAggregation is a custom aggregation function that takes the column ID, the leaf rows, and the child rows, and returns the aggregated value. You can then use this aggregation function in a column's aggregationFn option:

```ts
const column = columnHelper.accessor('key', {
  aggregationFn: 'myCustomAggregation',
})
```

> **TypeScript Note:** String references like `aggregationFn: 'myCustomAggregation'` are automatically typed when the function is registered in the `aggregationFns` slot on `tableFeatures`. The registry slot replaces the old `declare module` augmentation approach. Alternatively, skip the registry entirely by passing the function directly to the `aggregationFn` column option.

### Manual Grouping

If you are doing server-side grouping and aggregation, you can enable manual grouping using the manualGrouping option. When this option is set to true, the table will not automatically group rows using getGroupedRowModel() and instead will expect you to manually group the rows before passing them to the table.

```ts
const features = tableFeatures({ columnGroupingFeature })

const table = this.tableController.table({
  features,
  // other options...
  manualGrouping: true,
})
```

> **Note:** There are not currently many known easy ways to do server-side grouping with TanStack Table. You will need to do lots of custom cell rendering to make this work.

### Controlled Grouping State

If you need access to the grouping state in other parts of your application, you can own the `grouping` state slice yourself. The recommended way in v9 is an external atom passed through the `atoms` table option. Atoms preserve fine-grained subscriptions, and the grouping value can be read or subscribed to from any module (such as in a query key for server-side grouping) without going through the component that owns the table.

```ts
import { createAtom } from '@tanstack/store'
import type { GroupingState } from '@tanstack/lit-table'

// create a stable atom at module scope (or in a shared store module)
const groupingAtom = createAtom<GroupingState>([])

const table = this.tableController.table({
  features,
  // other options...
  atoms: {
    grouping: groupingAtom, // grouping APIs now update groupingAtom
  },
})

// read groupingAtom.get() (or subscribe to groupingAtom) wherever you need the value
```

Alternatively, the v8-style `state.grouping` plus `onGroupingChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
@state()
private grouping: GroupingState = []

const table = this.tableController.table({
  features,
  // other options...
  state: {
    grouping: this.grouping,
  },
  onGroupingChange: (updater) => {
    this.grouping = typeof updater === 'function' ? updater(this.grouping) : updater
  },
})
```

### Grouping APIs

Columns expose grouping APIs for toggling grouping and building grouping UI:

```ts
column.toggleGrouping()
column.getToggleGroupingHandler()
column.getCanGroup()
column.getIsGrouped()
column.getGroupedIndex()
column.getAutoAggregationFn()
column.getAggregationFn()
```

Rows expose grouping helpers for grouped row rendering:

```ts
row.getIsGrouped()
row.getGroupingValue(columnId)
row.groupingColumnId
row.groupingValue
```

Cells expose helpers for choosing between grouped, aggregated, placeholder, and normal cell rendering:

```ts
cell.getIsGrouped()
cell.getIsAggregated()
cell.getIsPlaceholder()
```

The table instance exposes grouped and pre-grouped row models:

```ts
table.getGroupedRowModel()
table.getPreGroupedRowModel()
```

Use `table.setGrouping` and `table.resetGrouping` to update the grouping state directly.

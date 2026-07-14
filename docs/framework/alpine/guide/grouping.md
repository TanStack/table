---
title: Grouping (Alpine) Guide
---

## Examples

Want to skip to the implementation? Check out these Alpine examples:

- [Grouping](../examples/grouping)

Aggregation is an independent feature. See the core [Aggregation Guide](../../../guide/aggregation) for totals, multiple aggregations, custom definitions, and grouped aggregate values.

Read your reactive inputs such as `data` through a getter (for example backing them with `Alpine.reactive`) when creating the table, so the table sees updates.

### Grouping Setup

Here's how you set up your table to use grouping features. Adding the grouping feature enables the related APIs. Additionally, if using client-side grouping, you also need to set up `groupedRowModel` after its associated feature because row model slots are type-checked.

```ts
import {
  aggregationFeature,
  aggregationFn_sum,
  columnGroupingFeature,
  createGroupedRowModel,
  createTable,
  tableFeatures,
} from '@tanstack/alpine-table'

const features = tableFeatures({
  aggregationFeature,
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(), // if using client-side grouping
  aggregationFns: { sum: aggregationFn_sum },
})

const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
})
```

> **NOTE**: Spreading the entire built-in registry (`aggregationFns: { ...aggregationFns }`) still works, but it puts every built-in aggregation function in your bundle. Registering just the functions you use, or passing a function directly to the `aggregationFn` column option, is recommended.

## Grouping (Alpine) Guide

Grouping in TanStack table is a feature that applies to columns and allows you to categorize and organize the table rows based on specific columns. This can be useful in cases where you have a large amount of data and you want to group them together based on certain criteria.

Grouping can also affect column order. There are 3 table features that can reorder columns, which happen in the following order:

1. [Column Pinning](./column-pinning) - If pinning, columns are split into start, center (unpinned), and end pinned columns.
2. Manual [Column Ordering](./column-ordering) - A manually specified column order is applied.
3. **Grouping** - If grouping is enabled, a grouping state is active, and `tableOptions.groupedColumnMode` is set to `'reorder' | 'remove'`, then the grouped columns are reordered to the start of the column flow.

To use the grouping feature, add the `columnGroupingFeature` and the `groupedRowModel` factory to your features. The grouped row model is responsible for grouping the rows based on the grouping state.

```ts
import {
  aggregationFeature,
  aggregationFn_sum,
  columnGroupingFeature,
  createGroupedRowModel,
  createTable,
  tableFeatures,
} from '@tanstack/alpine-table'

const features = tableFeatures({
  aggregationFeature,
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  aggregationFns: { sum: aggregationFn_sum },
})

const table = createTable({
  features,
  // other options...
})
```

When grouping state is active, the table will add matching rows as subRows to the grouped row. The grouped row will be added to the table rows at the same index as the first matching row. The matching rows will be removed from the table rows.
To allow the user to expand and collapse the grouped rows, you can use the expanding feature.

```ts
const features = tableFeatures({
  aggregationFeature,
  columnGroupingFeature,
  rowExpandingFeature,
  groupedRowModel: createGroupedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  aggregationFns: { sum: aggregationFn_sum },
})

const table = createTable({
  features,
  // other options...
})
```

### Grouping state

The grouping state is an array of strings, where each string is the ID of a column to group by. The order of the strings in the array determines the order of the grouping. For example, if the grouping state is ['column1', 'column2'], then the table will first group by column1, and then within each group, it will group by column2. You can control the grouping state using the setGrouping function:

```ts
table.setGrouping(['column1', 'column2'])
```

You can also reset the grouping state to its initial state using the resetGrouping function:

```ts
table.resetGrouping()
```

By default, when a column is grouped, it is moved to the start of the table. You can control this behavior using the groupedColumnMode option. If you set it to 'reorder', then the grouped columns will be moved to the start of the table. If you set it to 'remove', then the grouped columns will be removed from the table. If you set it to false, then the grouped columns will not be moved or removed.

```ts
const table = createTable({
  features,
  // other options...
  groupedColumnMode: 'reorder',
})
```

### Aggregations

When both features are registered, grouped rows can aggregate data with the `aggregationFn` column option. It can be a registered name, an inline definition, or an array of aggregations.

```ts
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

You can define custom aggregation functions in the `aggregationFns` slot on `tableFeatures`. The slot is a record where the keys are the names of the aggregation functions, and the values are the aggregation functions themselves. You can then reference these aggregation functions by name in a column's `aggregationFn` option.

```ts
const myCustomAggregation = constructAggregationFn({
  aggregate: ({ rows, getValue }) =>
    rows
      .map((row) => getValue(row))
      .filter(Boolean)
      .join(', '),
})

const features = tableFeatures({
  aggregationFeature,
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  aggregationFns: { sum: aggregationFn_sum, myCustomAggregation },
})

const table = createTable({
  features,
  // other options...
})
```

The context supplies normalized terminal `rows`, `getValue`, `column`, `table`, and an optional `groupingRow`. You can then use the definition in a column's `aggregationFn` option:

```ts
const column = columnHelper.accessor('key', {
  aggregationFn: 'myCustomAggregation',
})
```

> **TypeScript Note:** For `aggregationFn: 'myCustomAggregation'` string references to typecheck, register the function in the `aggregationFns` slot on `tableFeatures` (as shown above). The slot is the registry; no `declare module` augmentation is needed. Alternatively, skip the registry entirely by passing the function directly to the `aggregationFn` column option.

For efficient nested grouping, a definition can also provide `merge({ childResults, childRows })`. See the [Aggregation Guide](../../../guide/aggregation#custom-aggregation-definitions).

### Manual Grouping

If you are doing server-side grouping and aggregation, you can enable manual grouping using the manualGrouping option. When this option is set to true, the table will not automatically group rows using getGroupedRowModel() and instead will expect you to manually group the rows before passing them to the table.

```ts
const features = tableFeatures({ columnGroupingFeature })

const table = createTable({
  features,
  // other options...
  manualGrouping: true,
})
```

> **Note:** There are not currently many known easy ways to do server-side grouping with TanStack Table. You will need to do lots of custom cell rendering to make this work.

### Controlled Grouping State

If you need access to the grouping state in other parts of your application, you can own the `grouping` state slice yourself. The recommended way in v9 is an external atom passed through the `atoms` table option. `@tanstack/store` is already a dependency of `@tanstack/alpine-table`, so `createAtom` is available. The atom can be read, written, or subscribed to anywhere in your app (such as in a query key for server-side grouping) without making the table depend on component-local state.

```ts
import { createAtom } from '@tanstack/store'
import type { GroupingState } from '@tanstack/alpine-table'

const groupingAtom = createAtom<GroupingState>([])

// subscribe to the atom wherever you need the value
groupingAtom.subscribe(() => {
  // react to grouping changes
})

const table = createTable({
  features,
  // other options...
  atoms: {
    grouping: groupingAtom, // grouping APIs now update groupingAtom
  },
})
```

Alternatively, the v8-style `state.grouping` plus `onGroupingChange` pattern is still supported by owning the slice in `Alpine.reactive`. It can be convenient for simple integrations or when migrating v8 code. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
const local = Alpine.reactive({ grouping: [] as GroupingState })

const table = createTable({
  features,
  // other options...
  state: {
    get grouping() {
      return local.grouping // connect the reactive slice back down to the table
    },
  },
  onGroupingChange: (updater) => {
    local.grouping =
      typeof updater === 'function' ? updater(local.grouping) : updater
  },
})
```

You can read the current grouping value with `table.atoms.grouping.get()`. Inside an Alpine binding this is a reactive read; in event handlers it simply returns the current value.

### Wiring up the grouping UI

Because Alpine does not initialize directives inside content set with `x-html`, the in-cell grouping controls (the header group toggle button and the grouped-cell expander) cannot live inside an `x-html` span. Render the header and cell content with `x-html="FlexRender(...)"`, but special-case the interactive parts directly in the markup using the cell helpers (`cell.getIsGrouped()`, `cell.getIsAggregated()`, `cell.getIsPlaceholder()`).

The group toggle button lives in the header. Call the handler returned by `getToggleGroupingHandler` with the event.

```html
<th :colspan="header.colSpan">
  <template x-if="!header.isPlaceholder">
    <div class="inline-controls">
      <template x-if="header.column.getCanGroup()">
        <button
          style="cursor: pointer"
          @click="header.column.getToggleGroupingHandler()($event)"
          x-text="header.column.getIsGrouped() ? '🛑(' + header.column.getGroupedIndex() + ') ' : '👊 '"
        ></button>
      </template>
      <span x-html="FlexRender({ header })"></span>
    </div>
  </template>
</th>
```

In the cell, choose between grouped, aggregated, placeholder, and normal rendering. The grouped cell also carries the expander button (which calls the row's `getToggleExpandedHandler`). It helps to expose a small helper on your `Alpine.data` object for the cell background.

```ts
Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(10_000) })

  const table = createTable({
    features,
    columns,
    get data() {
      return local.data
    },
  })

  return {
    table,
    FlexRender,
    cellBackground(cell) {
      if (cell.getIsGrouped()) return '#0aff0082'
      if (cell.getIsAggregated()) return '#ffa50078'
      if (cell.getIsPlaceholder()) return '#ff000042'
      return 'white'
    },
  }
})
```

```html
<td :style="'background: ' + cellBackground(cell)">
  <!-- grouped cell: expander + value + count -->
  <template x-if="cell.getIsGrouped()">
    <button
      @click="cell.row.getToggleExpandedHandler()($event)"
      :style="'cursor: ' + (cell.row.getCanExpand() ? 'pointer' : 'normal')"
    >
      <span x-text="cell.row.getIsExpanded() ? '👇' : '👉'"></span>
      <span x-html="FlexRender({ cell })"></span>
      <span
        x-text="'(' + cell.row.subRows.length.toLocaleString() + ')'"
      ></span>
    </button>
  </template>
  <!-- aggregated cell -->
  <template x-if="cell.getIsAggregated()">
    <span x-html="FlexRender({ cell })"></span>
  </template>
  <!-- placeholder cell: nothing -->
  <template x-if="cell.getIsPlaceholder()">
    <span></span>
  </template>
  <!-- normal cell -->
  <template
    x-if="!cell.getIsGrouped() && !cell.getIsAggregated() && !cell.getIsPlaceholder()"
  >
    <span x-html="FlexRender({ cell })"></span>
  </template>
</td>
```

### Grouping APIs

Columns expose grouping APIs for toggling grouping and building grouping UI:

```ts
column.toggleGrouping()
column.getToggleGroupingHandler()
column.getCanGroup()
column.getIsGrouped()
column.getGroupedIndex()
```

Rows expose grouping helpers for grouped row rendering:

```ts
row.getIsGrouped()
row.getGroupingValue(columnId)
row.groupingColumnId
row.groupingValue
```

Cells expose grouping and placeholder helpers:

```ts
cell.getIsGrouped()
cell.getIsPlaceholder()
```

`cell.getIsAggregated()`, `column.getAutoAggregationFn()`, `column.getAggregationFns()`, and `column.getAggregationValue()` belong to `aggregationFeature`.

The table instance exposes grouped and pre-grouped row models:

```ts
table.getGroupedRowModel()
table.getPreGroupedRowModel()
```

Use `table.setGrouping` and `table.resetGrouping` to update the grouping state directly.

---
name: grouping
description: >
  Group rows by column values in TanStack Table v9 with the `groupedRowModel`
  stage. Covers `columnGroupingFeature` + `createGroupedRowModel()` (registered on `features` with `aggregationFns` slot),
  `state.grouping` (GroupingState = Array<string>), `onGroupingChange`,
  `columnDef.aggregationFn` ('auto'|name|fn) — distinct signature
  `(columnId, leafRows, childRows)` — `columnDef.aggregatedCell`,
  `columnDef.getGroupingValue`, `groupedColumnMode` (false|'reorder'|'remove'),
  `manualGrouping`, `column.toggleGrouping` / `getCanGroup` / `getIsGrouped`,
  `row.getIsGrouped` / `groupingColumnId` / `leafRows`, `cell.getIsGrouped` /
  `getIsAggregated` / `getIsPlaceholder`, the built-in `aggregationFns` registry,
  and the required `rowExpandingFeature` pairing for drill-down UX.
type: core
library: tanstack-table
library_version: '9.0.0-alpha.48'
requires:
  - state-management
  - customizing-feature-behavior
sources:
  - TanStack/table:docs/guide/grouping.md
  - TanStack/table:packages/table-core/src/fns/aggregationFns.ts
  - TanStack/table:packages/table-core/src/features/column-grouping/createGroupedRowModel.ts
  - TanStack/table:examples/react/grouping/src/main.tsx
---

This skill builds on `tanstack-table/state-management` and `tanstack-table/customizing-feature-behavior`. Read those first for the atom model and `aggregationFn` signature.

## Setup

Grouping nearly always pairs with expanding — otherwise grouped rows show aggregates with no way to drill in.

```ts
import {
  tableFeatures,
  columnGroupingFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  createGroupedRowModel,
  createExpandedRowModel,
  createPaginatedRowModel,
  aggregationFns,
  createColumnHelper,
  constructTable,
} from '@tanstack/table-core'
import type { GroupingState } from '@tanstack/table-core'

const features = tableFeatures({
  columnGroupingFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  groupedRowModel: createGroupedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  aggregationFns,
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    aggregatedCell: () => null,
    enableGrouping: false,
  }),
  columnHelper.accessor('age', { aggregationFn: 'median' }),
  columnHelper.accessor('visits', { aggregationFn: 'sum' }),
  columnHelper.accessor('status', { aggregationFn: 'count' }),
  columnHelper.accessor('progress', { aggregationFn: 'mean' }),
])

const table = constructTable({
  features,
  columns,
  data,
  initialState: { grouping: [] satisfies GroupingState },
})

table.setGrouping(['status'])
```

## Core Patterns

### Per-column group toggle + aggregated cell rendering

```tsx
// From examples/react/grouping/src/main.tsx
{
  headerGroup.headers.map((header) => (
    <th key={header.id}>
      {header.column.getCanGroup() ? (
        <button onClick={header.column.getToggleGroupingHandler()}>
          {header.column.getIsGrouped()
            ? `🛑(${header.column.getGroupedIndex()}) `
            : '👊 '}
        </button>
      ) : null}
      <table.FlexRender header={header} />
    </th>
  ))
}

// Cell renderer with three branches: grouped, aggregated, normal
{
  row.getVisibleCells().map((cell) => (
    <td key={cell.id}>
      {cell.getIsGrouped() ? (
        <>
          <button onClick={row.getToggleExpandedHandler()}>
            {row.getIsExpanded() ? '👇' : '👉'}
          </button>{' '}
          <table.FlexRender cell={cell} /> ({row.subRows.length})
        </>
      ) : cell.getIsAggregated() ? (
        <table.FlexRender cell={cell} />
      ) : cell.getIsPlaceholder() ? null : (
        <table.FlexRender cell={cell} />
      )}
    </td>
  ))
}
```

### Custom `aggregationFn`

```ts
import type { AggregationFn } from '@tanstack/table-core'

// Signature: (columnId, leafRows, childRows) → aggregated value
// leafRows = ALL descendant non-grouped rows (recursive)
// childRows = immediate children (may themselves be sub-aggregates)
const weightedAverage: AggregationFn<typeof features, Person> = (
  columnId,
  leafRows,
) => {
  let totalWeight = 0
  let weightedSum = 0
  leafRows.forEach((row) => {
    const v = row.getValue<number>(columnId)
    const w = row.original.weight
    weightedSum += v * w
    totalWeight += w
  })
  return totalWeight === 0 ? 0 : weightedSum / totalWeight
}

const customFeatures = tableFeatures({
  columnGroupingFeature,
  rowExpandingFeature,
  groupedRowModel: createGroupedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  aggregationFns: { ...aggregationFns, weightedAverage },
})

const table = constructTable({
  features: customFeatures,
  columns: columnHelper.columns([
    columnHelper.accessor('progress', {
      aggregationFn: 'weightedAverage',
      aggregatedCell: (info) => `${info.getValue<number>().toFixed(1)}%`,
    }),
  ]),
  data,
})
```

### Override grouping key with `getGroupingValue`

```ts
columnHelper.accessor('firstName', {
  // group by full name, not just firstName
  getGroupingValue: (row) => `${row.firstName} ${row.lastName}`,
})
```

### Control grouped-column placement

```ts
const table = constructTable({
  features,
  columns,
  data,
  groupedColumnMode: 'reorder', // default — grouped columns lead
  // groupedColumnMode: 'remove', // hide grouped columns from visible flow
  // groupedColumnMode: false,    // keep columnOrder intact
})
```

## Common Mistakes

### [HIGH] Adding `columnGroupingFeature` without `rowExpandingFeature`

Wrong:

```ts
// grouped rows show aggregates but can't be expanded
const features = tableFeatures({
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  aggregationFns,
})
const table = useTable({ features, columns, data })
// row.getToggleExpandedHandler() → TS error or undefined
```

Correct:

```ts
import {
  aggregationFns,
  columnGroupingFeature,
  createExpandedRowModel,
  createGroupedRowModel,
  rowExpandingFeature,
} from '@tanstack/react-table'

const features = tableFeatures({
  columnGroupingFeature,
  rowExpandingFeature,
  groupedRowModel: createGroupedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  aggregationFns,
})

const table = useTable({ features, columns, data })

// In cell renderer:
{cell.getIsGrouped() && (
  <button onClick={row.getToggleExpandedHandler()}>
    {row.getIsExpanded() ? '👇' : '👉'} ({row.subRows.length})
  </button>
)}
```

Without `rowExpandingFeature`, `row.getToggleExpandedHandler` doesn't exist — grouped rows stay collapsed forever.

Source: examples/react/grouping/src/main.tsx

### [HIGH] Customizing aggregationFns via a v8-style `tableOptions.aggregationFns` option

Wrong:

```ts
const table = useTable({
  features: tableFeatures({
    columnGroupingFeature,
    groupedRowModel: createGroupedRowModel(),
    aggregationFns,
  }),
  columns, data,
  // @ts-ignore - this property doesn't exist on v9 TableOptions
  aggregationFns: {
    myCustom: (id, leaf, child) => /* ... */,
  },
})
```

Correct:

```ts
import { aggregationFns, createGroupedRowModel } from '@tanstack/react-table'

const features = tableFeatures({
  columnGroupingFeature,
  rowExpandingFeature,
  groupedRowModel: createGroupedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  aggregationFns: {
    ...aggregationFns,
    myCustomAggregation: (columnId, leafRows, childRows) => {
      return /* aggregated value */
    },
  },
})

const table = useTable({ features, columns, data })

// Then on a column:
columnHelper.accessor('sales', { aggregationFn: 'myCustomAggregation' })
```

In v9, the aggregation registry is the `aggregationFns` slot on `features`. There is no top-level `tableOptions.aggregationFns`.

Source: packages/table-core/src/features/column-grouping/createGroupedRowModel.ts

### [MEDIUM] Confusing the `aggregationFn` signature with filter/sort signatures

Wrong:

```ts
// wrong arg names — first arg is columnId, not row
aggregationFn: (rowA, rowB, columnId) => /* ... */

// or: averaging via childRows includes already-aggregated sub-group sums
aggregationFn: (id, leaf, child) => child.reduce((a, r) => a + r.getValue(id), 0) / child.length
```

Correct:

```ts
// (columnId, leafRows, childRows)
// leafRows = all descendant non-grouped rows
// childRows = immediate children (may be sub-aggregates)

// For pure leaf averages, use leafRows:
const aggregationFn_mean: AggregationFn<any, any> = (columnId, leafRows) => {
  let count = 0,
    sum = 0
  leafRows.forEach((row) => {
    const value = row.getValue(columnId)
    if (typeof value === 'number') {
      count++
      sum += value
    }
  })
  return count ? sum / count : undefined
}

// For nestable sums (reuse sub-aggregates), use childRows:
const aggregationFn_sum: AggregationFn<any, any> = (
  columnId,
  _leafRows,
  childRows,
) => {
  return childRows.reduce((acc, next) => {
    const v = next.getValue(columnId)
    return acc + (typeof v === 'number' ? v : 0)
  }, 0)
}
```

Built-in `mean`, `median`, `unique`, `uniqueCount`, `count` use `leafRows`. `sum`, `min`, `max`, `extent` use `childRows`.

Source: packages/table-core/src/fns/aggregationFns.ts

### [MEDIUM] Expecting grouped columns to keep their original position

Wrong:

```ts
const table = useTable({
  features,
  columns,
  data,
  initialState: {
    columnOrder: ['firstName', 'lastName', 'age', 'status'], // explicit
    grouping: ['status'],
  },
  // status jumps to position 0 — columnOrder is "overridden"
})
```

Correct:

```ts
const table = useTable({
  features,
  columns,
  data,
  initialState: {
    columnOrder: ['firstName', 'lastName', 'age', 'status'],
    grouping: ['status'],
  },
  groupedColumnMode: false, // keep columnOrder intact
})

// Or hide grouped columns entirely:
// groupedColumnMode: 'remove'
```

`columnGroupingFeature.getDefaultTableOptions` sets `groupedColumnMode: 'reorder'`, which moves grouped columns to the start.

Source: packages/table-core/src/features/column-ordering/columnOrderingFeature.utils.ts

### [LOW] Calling `getSelectedRowModel()` on a grouped table expecting grouped rows

Wrong:

```ts
// returns selection from the CORE model, not the grouped projection
const selectedRows = table.getSelectedRowModel().rows
// Doesn't reflect grouping — leaf rows only
```

Correct:

```ts
table.getSelectedRowModel() // selection from raw data
table.getFilteredSelectedRowModel() // selection within current filters
table.getGroupedSelectedRowModel() // selection within current groups
```

Three distinct APIs. Pick the model matching the question being asked.

Source: packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts

### [CRITICAL] Reimplementing aggregation manually

Wrong:

```ts
// Hand-rolled groupBy + reduce, bypassing the table
const grouped = useMemo(() => {
  const map = new Map<string, Person[]>()
  data.forEach((row) => {
    const key = row.status
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(row)
  })
  return Array.from(map.entries()).map(([k, rows]) => ({
    status: k,
    avgAge: rows.reduce((s, r) => s + r.age, 0) / rows.length,
  }))
}, [data])
```

Correct:

```ts
const features = tableFeatures({
  columnGroupingFeature,
  rowExpandingFeature,
  groupedRowModel: createGroupedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  aggregationFns,
})
const table = useTable({
  features,
  columns: columnHelper.columns([
    columnHelper.accessor('status', { enableGrouping: true }),
    columnHelper.accessor('age', { aggregationFn: 'mean' }),
  ]),
  data,
})
table.setGrouping(['status'])
```

Source: maintainer interview (Phase 4, 2026-05-17)

## See also

- `tanstack-table/row-expanding` — required pairing for grouped drill-down
- `tanstack-table/customizing-feature-behavior` — `aggregationFn` authoring
- `tanstack-table/row-selection` — `getGroupedSelectedRowModel` distinction

# Grouping

Grouping creates row structure and the renderer chooses grouped-cell UI. Read [aggregation](aggregation.md) when grouped rows should also calculate values.

## Setup

```ts
import {
  columnGroupingFeature,
  createGroupedRowModel,
  tableFeatures,
} from '@tanstack/table-core'

export const features = tableFeatures({
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
})
```

## Core patterns

```ts
const options = { groupedColumnMode: 'reorder' as const }
const mode = cell.getIsGrouped()
  ? 'grouped'
  : cell.getIsPlaceholder()
    ? 'placeholder'
    : 'value'
```

Render these cell modes deliberately. Group headers are rows in the model and count toward built-in `pageSize`; pagination does not count only leaf records. Read [expanding](expanding.md) or [pagination](pagination.md) when changing those interactions.

## Common mistakes

### [HIGH] Registering processing without grouping

Wrong: `tableFeatures({ groupedRowModel: createGroupedRowModel() })`

Correct: `tableFeatures({ columnGroupingFeature, groupedRowModel: createGroupedRowModel() })`

The grouped row-model slot requires `columnGroupingFeature`.

Source: `packages/table-core/src/types/TableFeatures.ts#FeatureSlotPrereqs`

### [HIGH] Treating rendered rows as underlying records

Wrong: `const leafCount = table.getRowModel().flatRows.filter(row => !row.subRows.length).length`

Correct:

```ts
const countLeafRows = (rows: typeof groupRow.subRows): number =>
  rows.reduce(
    (count, row) =>
      count + (row.subRows.length ? countLeafRows(row.subRows) : 1),
    0,
  )
const leafCount = countLeafRows(groupRow.subRows)
```

Count descendants from one group row rather than the flattened render model,
where group rows and expanded rows may both appear. The current
`table.getRowModel().rows` is render order, while original dataset counts come
from the data owner.

Source: `docs/framework/react/guide/grouping.md`

### [HIGH] Rendering every cell identically

Wrong: `render(cell.getValue())`

Correct: `render(cell.getIsPlaceholder() ? null : cell.getValue())`

Placeholder cells do not represent ordinary leaf values. Group rows should
only render their grouped cell when aggregation is not enabled.

Source: `examples/react/grouping/src/main.tsx`

## API discovery

Inspect `node_modules/@tanstack/table-core/dist/features/column-grouping/` for
grouping. Read [aggregation](aggregation.md) when totals, multiple aggregations,
grouped aggregate values, or custom definitions are part of the task.

## Sources

- `TanStack/table:docs/framework/react/guide/grouping.md`
- `TanStack/table:packages/table-core/src/features/column-grouping`
- `TanStack/table:examples/react/grouping`

---
id: row_getToggleSelectedHandler
title: row_getToggleSelectedHandler
---

# Function: row\_getToggleSelectedHandler()

```ts
function row_getToggleSelectedHandler<TFeatures, TData>(row, opts?): (e) => void;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:698](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L698)

Creates a checkbox-style handler that selects or deselects this row.

The handler is a no-op when the row cannot be selected and reads
`event.target.checked`. Shift events select or deselect the inclusive range
from the most recent selectable row handled by this table. Pass
`selectChildren: false` to limit changes to rows explicitly present in the
display-order interval, and `deselectParents: true` to remove ancestor row
ids from the selection when rows are deselected.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

### opts?

[`ToggleSelectedOptions`](../../index/interfaces/ToggleSelectedOptions.md)

## Returns

```ts
(e): void;
```

### Parameters

#### e

`unknown`

### Returns

`void`

## Example

```ts
const onChange = row_getToggleSelectedHandler(row)
```

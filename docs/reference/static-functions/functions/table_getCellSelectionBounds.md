---
id: table_getCellSelectionBounds
title: table_getCellSelectionBounds
---

# Function: table\_getCellSelectionBounds()

```ts
function table_getCellSelectionBounds<TFeatures, TData>(table): CellSelectionBounds[];
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:411](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L411)

Resolves ordered range operations into disjoint, positive display-order
index rectangles.

This is the single cache every per-cell read goes through, so index lookups
happen once per invalidation rather than once per cell. A range whose corners
no longer resolve, for example because its anchor row was filtered out, is
omitted rather than clamped, so it contributes nothing while remaining in
state and returns intact when the filter clears.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`CellSelectionBounds`](../../index/interfaces/CellSelectionBounds.md)[]

## Example

```ts
const bounds = table_getCellSelectionBounds(table)
```

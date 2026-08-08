---
id: cell_getSelectionEdges
title: cell_getSelectionEdges
---

# Function: cell\_getSelectionEdges()

```ts
function cell_getSelectionEdges<TFeatures, TData, TValue>(cell): CellSelectionEdges;
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:654](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L654)

Returns which sides of this cell sit on the outer boundary of the selection.

A side is an edge when the neighbouring cell in that direction is not itself
covered by a range, which is what lets a consumer draw a single outline
around an arbitrary union of rectangles.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### cell

[`Cell`](../../index/type-aliases/Cell.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

[`CellSelectionEdges`](../../index/interfaces/CellSelectionEdges.md)

## Example

```ts
const { top, right, bottom, left } = cell_getSelectionEdges(cell)
```

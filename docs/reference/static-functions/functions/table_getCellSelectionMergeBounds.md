---
id: table_getCellSelectionMergeBounds
title: table_getCellSelectionMergeBounds
---

# Function: table\_getCellSelectionMergeBounds()

```ts
function table_getCellSelectionMergeBounds<TFeatures, TData>(table): CellSelectionBounds[];
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:255](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L255)

Resolves the merged-cell rectangles of the rendered rows into selection's
own index space.

The span index positions rows by their paginated render order while
selection positions them by pre-paginated display order, so each merge is
mapped through `row.getDisplayIndex()`. A merge whose rows do not map to a
contiguous display range is skipped defensively; it then behaves like
unmerged cells instead of corrupting the geometry.

Returns an empty array when `cellSpanningFeature` is not registered, which
keeps every selection code path identical to the span-unaware behavior.

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
const merges = table_getCellSelectionMergeBounds(table)
```

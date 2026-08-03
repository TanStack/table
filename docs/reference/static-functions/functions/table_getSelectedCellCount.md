---
id: table_getSelectedCellCount
title: table_getSelectedCellCount
---

# Function: table\_getSelectedCellCount()

```ts
function table_getSelectedCellCount<TFeatures, TData>(table): number;
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:1241](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L1241)

Returns the number of selected cells.

Uses rectangle arithmetic over the normalized, disjoint positive regions.
A per-cell `enableCellSelection` predicate requires enumeration.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`number`

## Example

```ts
const count = table_getSelectedCellCount(table)
```

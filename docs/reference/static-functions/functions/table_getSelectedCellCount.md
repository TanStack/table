---
id: table_getSelectedCellCount
title: table_getSelectedCellCount
---

# Function: table\_getSelectedCellCount()

```ts
function table_getSelectedCellCount<TFeatures, TData>(table): number;
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:932](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L932)

Returns the number of selected cells.

Uses rectangle arithmetic for a single range, which needs no expansion.
Multiple ranges are enumerated so overlapping cells are counted once. A
per-cell `enableCellSelection` predicate also requires enumeration.

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

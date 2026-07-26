---
id: table_getSelectedCellRangesData
title: table_getSelectedCellRangesData
---

# Function: table\_getSelectedCellRangesData()

```ts
function table_getSelectedCellRangesData<TFeatures, TData>(table): unknown[][][];
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:905](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L905)

Returns each selected range's values as a row-major grid.

This is the raw material for clipboard export. Serializing it to text is left
to userland, since the delimiter, the null representation, and whether values
containing delimiters get quoted are all application decisions.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`unknown`[][][]

## Example

```ts
const [firstRange] = table_getSelectedCellRangesData(table)
```

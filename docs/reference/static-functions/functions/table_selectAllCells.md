---
id: table_selectAllCells
title: table_selectAllCells
---

# Function: table\_selectAllCells()

```ts
function table_selectAllCells<TFeatures, TData>(table): void;
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:599](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L599)

Selects every selectable cell in the table as one range.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`void`

## Example

```ts
table_selectAllCells(table)
```

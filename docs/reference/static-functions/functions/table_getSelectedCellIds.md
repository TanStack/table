---
id: table_getSelectedCellIds
title: table_getSelectedCellIds
---

# Function: table\_getSelectedCellIds()

```ts
function table_getSelectedCellIds<TFeatures, TData>(table): string[];
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:838](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L838)

Returns the ids of all selected cells, in row-major order per range.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`string`[]

## Example

```ts
const ids = table_getSelectedCellIds(table)
```

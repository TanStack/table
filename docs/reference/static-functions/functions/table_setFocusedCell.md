---
id: table_setFocusedCell
title: table_setFocusedCell
---

# Function: table\_setFocusedCell()

```ts
function table_setFocusedCell<TFeatures, TData>(
   table,
   rowId,
   columnId): void;
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:532](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L532)

Collapses the selection to a single cell at the given coordinates.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

### rowId

`string`

### columnId

`string`

## Returns

`void`

## Example

```ts
table_setFocusedCell(table, '3', 'firstName')
```

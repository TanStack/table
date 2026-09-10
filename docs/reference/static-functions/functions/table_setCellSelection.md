---
id: table_setCellSelection
title: table_setCellSelection
---

# Function: table\_setCellSelection()

```ts
function table_setCellSelection<TFeatures, TData>(table, updater): void;
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:54](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L54)

Routes a cell selection updater through the table's selection change handler.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../../index/type-aliases/Updater.md)\<[`CellSelectionState`](../../index/type-aliases/CellSelectionState.md)\>

## Returns

`void`

## Example

```ts
table_setCellSelection(table, (old) => old.slice(0, -1))
```

---
id: table_extendCellSelection
title: table_extendCellSelection
---

# Function: table\_extendCellSelection()

```ts
function table_extendCellSelection<TFeatures, TData>(table, direction): void;
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:1076](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L1076)

Extends the active range one step in a direction, keeping its anchor fixed.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

### direction

[`CellSelectionDirection`](../../index/type-aliases/CellSelectionDirection.md)

## Returns

`void`

## Example

```ts
table_extendCellSelection(table, 'right')
```

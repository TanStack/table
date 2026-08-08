---
id: table_moveCellSelection
title: table_moveCellSelection
---

# Function: table\_moveCellSelection()

```ts
function table_moveCellSelection<TFeatures, TData>(table, direction): void;
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:1036](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L1036)

Moves the selection one step in a direction, collapsing it to a single cell.

With nothing selected, this selects the first selectable cell so keyboard
navigation has somewhere to start.

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
table_moveCellSelection(table, 'down')
```

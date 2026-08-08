---
id: cell_getIsFocused
title: cell_getIsFocused
---

# Function: cell\_getIsFocused()

```ts
function cell_getIsFocused<TFeatures, TData, TValue>(cell): boolean;
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:610](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L610)

Checks whether this cell is the active cell.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### cell

[`Cell`](../../index/type-aliases/Cell.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`boolean`

## Example

```ts
const isFocused = cell_getIsFocused(cell)
```

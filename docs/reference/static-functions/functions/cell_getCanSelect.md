---
id: cell_getCanSelect
title: cell_getCanSelect
---

# Function: cell\_getCanSelect()

```ts
function cell_getCanSelect<TFeatures, TData, TValue>(cell): boolean;
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:515](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L515)

Checks whether this cell can currently be selected.

A column def opting out with `enableCellSelection: false` wins over the table
option, matching how the other per-column enable flags resolve.

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
const canSelect = cell_getCanSelect(cell)
```

---
id: cell_getIsGrouped
title: cell_getIsGrouped
---

# Function: cell\_getIsGrouped()

```ts
function cell_getIsGrouped<TFeatures, TData, TValue>(cell): boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:304](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L304)

Checks whether this cell represents the grouped column for a grouped row.

This is the cell that usually renders the grouped value and expansion control.

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
const isGroupedCell = cell_getIsGrouped(cell)
```

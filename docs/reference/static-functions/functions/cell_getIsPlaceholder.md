---
id: cell_getIsPlaceholder
title: cell_getIsPlaceholder
---

# Function: cell\_getIsPlaceholder()

```ts
function cell_getIsPlaceholder<TFeatures, TData, TValue>(cell): boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:326](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L326)

Checks whether this cell is a placeholder hidden by grouping.

Placeholder cells belong to grouped columns other than the row's active
grouping column.

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
const isPlaceholder = cell_getIsPlaceholder(cell)
```

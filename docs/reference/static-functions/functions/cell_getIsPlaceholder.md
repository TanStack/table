---
id: cell_getIsPlaceholder
title: cell_getIsPlaceholder
---

# Function: cell\_getIsPlaceholder()

```ts
function cell_getIsPlaceholder<TFeatures, TData, TValue>(cell): boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:315](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L315)

Returns is placeholder for a cell.

This is the static implementation behind the matching cell instance API and uses the owning row and column context.

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
const value = cell_getIsPlaceholder(cell)
```

---
id: cell_getIsGrouped
title: cell_getIsGrouped
---

# Function: cell\_getIsGrouped()

```ts
function cell_getIsGrouped<TFeatures, TData, TValue>(cell): boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:294](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L294)

Returns is grouped for a cell.

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
const value = cell_getIsGrouped(cell)
```

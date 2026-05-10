---
id: column_getIsGrouped
title: column_getIsGrouped
---

# Function: column\_getIsGrouped()

```ts
function column_getIsGrouped<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:86](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L86)

Returns is grouped for a column.

This derives the value from the column definition, table options, and the feature state atoms registered on the table.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../../index/type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`boolean`

## Example

```ts
const value = column_getIsGrouped(column)
```

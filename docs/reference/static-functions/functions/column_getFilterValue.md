---
id: column_getFilterValue
title: column_getFilterValue
---

# Function: column\_getFilterValue()

```ts
function column_getFilterValue<TFeatures, TData, TValue>(column): unknown;
```

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:156](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L156)

Returns filter value for a column.

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

`unknown`

## Example

```ts
const value = column_getFilterValue(column)
```

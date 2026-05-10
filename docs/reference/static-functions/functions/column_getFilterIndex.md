---
id: column_getFilterIndex
title: column_getFilterIndex
---

# Function: column\_getFilterIndex()

```ts
function column_getFilterIndex<TFeatures, TData, TValue>(column): number;
```

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:176](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L176)

Returns filter index for a column.

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

`number`

## Example

```ts
const value = column_getFilterIndex(column)
```

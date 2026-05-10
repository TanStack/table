---
id: column_getFacetedUniqueValues
title: column_getFacetedUniqueValues
---

# Function: column\_getFacetedUniqueValues()

```ts
function column_getFacetedUniqueValues<TFeatures, TData, TValue>(column, table): Map<any, number>;
```

Defined in: [features/column-faceting/columnFacetingFeature.utils.ts:65](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.utils.ts#L65)

Returns faceted unique values for a column.

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

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`Map`\<`any`, `number`\>

## Example

```ts
const value = column_getFacetedUniqueValues(column)
```

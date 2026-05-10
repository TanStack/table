---
id: column_getFacetedMinMaxValues
title: column_getFacetedMinMaxValues
---

# Function: column\_getFacetedMinMaxValues()

```ts
function column_getFacetedMinMaxValues<TFeatures, TData, TValue>(column, table): [number, number] | undefined;
```

Defined in: [features/column-faceting/columnFacetingFeature.utils.ts:17](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.utils.ts#L17)

Returns faceted min max values for a column.

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

\[`number`, `number`\] \| `undefined`

## Example

```ts
const value = column_getFacetedMinMaxValues(column)
```

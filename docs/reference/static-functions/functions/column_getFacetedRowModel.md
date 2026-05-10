---
id: column_getFacetedRowModel
title: column_getFacetedRowModel
---

# Function: column\_getFacetedRowModel()

```ts
function column_getFacetedRowModel<TFeatures, TData, TValue>(column, table): RowModel<TFeatures, TData>;
```

Defined in: [features/column-faceting/columnFacetingFeature.utils.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.utils.ts#L41)

Returns faceted row model for a column.

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

[`Column_Internal`](../../index/type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\> | `undefined`

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`RowModel`](../../index/interfaces/RowModel.md)\<`TFeatures`, `TData`\>

## Example

```ts
const value = column_getFacetedRowModel(column)
```

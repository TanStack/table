---
id: column_getFacetedRowModel
title: column_getFacetedRowModel
---

# Function: column\_getFacetedRowModel()

```ts
function column_getFacetedRowModel<TFeatures, TData, TValue>(column, table): RowModel<TFeatures, TData>;
```

Defined in: [features/column-faceting/columnFacetingFeature.utils.ts:44](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.utils.ts#L44)

Computes the row model used to derive one column's facet values.

The faceted row model normally applies every other active filter while
excluding this column's own filter. If no factory is registered, the
pre-filtered row model is returned.

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
const rows = column_getFacetedRowModel(column, table)
```

---
id: table_getGlobalFacetedRowModel
title: table_getGlobalFacetedRowModel
---

# Function: table\_getGlobalFacetedRowModel()

```ts
function table_getGlobalFacetedRowModel<TFeatures, TData>(table): RowModel<TFeatures, TData>;
```

Defined in: [features/column-faceting/columnFacetingFeature.utils.ts:116](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.utils.ts#L116)

Computes the row model used to derive global facet values.

The global context is requested with the internal `__global__` column id. If
no faceted row-model factory is registered, the pre-filtered row model is
returned.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`RowModel`](../../index/interfaces/RowModel.md)\<`TFeatures`, `TData`\>

## Example

```ts
const rows = table_getGlobalFacetedRowModel(table)
```

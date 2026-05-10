---
id: table_getGlobalFacetedRowModel
title: table_getGlobalFacetedRowModel
---

# Function: table\_getGlobalFacetedRowModel()

```ts
function table_getGlobalFacetedRowModel<TFeatures, TData>(table): RowModel<TFeatures, TData>;
```

Defined in: [features/column-faceting/columnFacetingFeature.utils.ts:109](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.utils.ts#L109)

Returns global faceted row model for the table.

This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.

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
const value = table_getGlobalFacetedRowModel(table)
```

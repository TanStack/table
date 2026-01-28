---
id: column_getFacetedRowModel
title: column_getFacetedRowModel
---

# Function: column\_getFacetedRowModel()

```ts
function column_getFacetedRowModel<TFeatures, TData, TValue>(column, table): RowModel<TFeatures, TData>;
```

Defined in: [packages/table-core/src/features/column-faceting/columnFacetingFeature.utils.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.utils.ts#L21)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\> | `undefined`

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`RowModel`](../interfaces/RowModel.md)\<`TFeatures`, `TData`\>

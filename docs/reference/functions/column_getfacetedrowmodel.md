---
id: column_getFacetedRowModel
title: column_getFacetedRowModel
---

# Function: column\_getFacetedRowModel()

```ts
function column_getFacetedRowModel<TFeatures, TData, TValue>(column, table): () => RowModel<TFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: `undefined` \| [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

`Function`

### Returns

[`RowModel`](../interfaces/rowmodel.md)\<`TFeatures`, `TData`\>

## Defined in

[features/column-faceting/ColumnFaceting.utils.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/ColumnFaceting.utils.ts#L21)

---
id: column_getFacetedRowModel
title: column_getFacetedRowModel
---

# Function: column\_getFacetedRowModel()

```ts
function column_getFacetedRowModel<TFeatures, TData, TValue>(column, table): () => RowModel<TFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

`Function`

### Returns

`RowModel`\<`TFeatures`, `TData`\>

## Defined in

[features/column-faceting/ColumnFaceting.utils.ts:22](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-faceting/ColumnFaceting.utils.ts#L22)

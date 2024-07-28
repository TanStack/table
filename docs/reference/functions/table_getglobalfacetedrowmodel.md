---
id: table_getGlobalFacetedRowModel
title: table_getGlobalFacetedRowModel
---

# Function: table\_getGlobalFacetedRowModel()

```ts
function table_getGlobalFacetedRowModel<TFeatures, TData>(table): () => RowModel<TFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

`Function`

### Returns

`RowModel`\<`TFeatures`, `TData`\>

## Defined in

[features/global-faceting/GlobalFaceting.utils.ts:27](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/global-faceting/GlobalFaceting.utils.ts#L27)

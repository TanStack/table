---
id: createFacetedRowModel
title: createFacetedRowModel
---

# Function: createFacetedRowModel()

```ts
function createFacetedRowModel<TFeatures, TData>(): (table, columnId) => () => RowModel<TFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Returns

`Function`

### Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **columnId**: `string`

### Returns

`Function`

#### Returns

`RowModel`\<`TFeatures`, `TData`\>

## Defined in

[features/column-faceting/createFacetedRowModel.ts:10](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-faceting/createFacetedRowModel.ts#L10)

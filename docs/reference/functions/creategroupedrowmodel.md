---
id: createGroupedRowModel
title: createGroupedRowModel
---

# Function: createGroupedRowModel()

```ts
function createGroupedRowModel<TFeatures, TData>(): (table) => () => RowModel<TFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Returns

`Function`

### Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

### Returns

`Function`

#### Returns

`RowModel`\<`TFeatures`, `TData`\>

## Defined in

[features/column-grouping/createGroupedRowModel.ts:12](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-grouping/createGroupedRowModel.ts#L12)

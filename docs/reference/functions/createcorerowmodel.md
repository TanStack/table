---
id: createCoreRowModel
title: createCoreRowModel
---

# Function: createCoreRowModel()

```ts
function createCoreRowModel<TFeatures, TData>(): (table) => () => RowModel<TFeatures, TData>
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

[core/table/createCoreRowModel.ts:10](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/table/createCoreRowModel.ts#L10)

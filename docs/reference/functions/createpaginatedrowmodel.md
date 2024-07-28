---
id: createPaginatedRowModel
title: createPaginatedRowModel
---

# Function: createPaginatedRowModel()

```ts
function createPaginatedRowModel<TFeatures, TData>(opts?): (table) => () => RowModel<TFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **opts?**

• **opts.initialSync?**: `boolean`

## Returns

`Function`

### Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

### Returns

`Function`

#### Returns

`RowModel`\<`TFeatures`, `TData`\>

## Defined in

[features/row-pagination/createPaginatedRowModel.ts:11](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/createPaginatedRowModel.ts#L11)

---
id: _createHeader
title: _createHeader
---

# Function: \_createHeader()

```ts
function _createHeader<TFeatures, TData, TValue>(
   table, 
   column, 
options): Header<TFeatures, TData, TValue>
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **options**

• **options.depth**: `number`

• **options.id?**: `string`

• **options.index**: `number`

• **options.isPlaceholder?**: `boolean`

• **options.placeholderId?**: `string`

## Returns

[`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`, `TValue`\>

## Defined in

[core/headers/createHeader.ts:8](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/createHeader.ts#L8)

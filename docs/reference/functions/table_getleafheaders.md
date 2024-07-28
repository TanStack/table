---
id: table_getLeafHeaders
title: table_getLeafHeaders
---

# Function: table\_getLeafHeaders()

```ts
function table_getLeafHeaders<TFeatures, TData>(
   left, 
   center, 
   right): Header<TableFeatures, TData, unknown>[]
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **left**: [`HeaderGroup`](../interfaces/headergroup.md)\<`TFeatures`, `TData`\>[]

• **center**: [`HeaderGroup`](../interfaces/headergroup.md)\<`TFeatures`, `TData`\>[]

• **right**: [`HeaderGroup`](../interfaces/headergroup.md)\<`TFeatures`, `TData`\>[]

## Returns

[`Header`](../type-aliases/header.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`, `unknown`\>[]

## Defined in

[core/headers/Headers.utils.ts:92](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.utils.ts#L92)

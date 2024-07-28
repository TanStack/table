---
id: table_getFlatHeaders
title: table_getFlatHeaders
---

# Function: table\_getFlatHeaders()

```ts
function table_getFlatHeaders<TFeatures, TData>(headerGroups): Header<TFeatures, TData, unknown>[]
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **headerGroups**: [`HeaderGroup`](../interfaces/headergroup.md)\<`TFeatures`, `TData`\>[]

## Returns

[`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Defined in

[core/headers/Headers.utils.ts:81](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.utils.ts#L81)

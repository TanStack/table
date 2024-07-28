---
id: table_getHeaderGroups
title: table_getHeaderGroups
---

# Function: table\_getHeaderGroups()

```ts
function table_getHeaderGroups<TFeatures, TData>(table): HeaderGroup<TableFeatures, TData>[]
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

[`HeaderGroup`](../interfaces/headergroup.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\>[]

## Defined in

[core/headers/Headers.utils.ts:44](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.utils.ts#L44)

---
id: table_getGlobalFacetedMinMaxValues
title: table_getGlobalFacetedMinMaxValues
---

# Function: table\_getGlobalFacetedMinMaxValues()

```ts
function table_getGlobalFacetedMinMaxValues<TFeatures, TData>(table): () => undefined | [number, number]
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

`Function`

### Returns

`undefined` \| [`number`, `number`]

## Defined in

[features/global-faceting/GlobalFaceting.utils.ts:12](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/global-faceting/GlobalFaceting.utils.ts#L12)

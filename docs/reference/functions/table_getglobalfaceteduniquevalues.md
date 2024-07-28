---
id: table_getGlobalFacetedUniqueValues
title: table_getGlobalFacetedUniqueValues
---

# Function: table\_getGlobalFacetedUniqueValues()

```ts
function table_getGlobalFacetedUniqueValues<TFeatures, TData>(table): () => Map<any, number>
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

`Function`

### Returns

`Map`\<`any`, `number`\>

## Defined in

[features/global-faceting/GlobalFaceting.utils.ts:42](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/global-faceting/GlobalFaceting.utils.ts#L42)

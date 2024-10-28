---
id: table_getGlobalFacetedMinMaxValues
title: table_getGlobalFacetedMinMaxValues
---

# Function: table\_getGlobalFacetedMinMaxValues()

```ts
function table_getGlobalFacetedMinMaxValues<TFeatures, TData>(table): () => undefined | [number, number]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

`Function`

### Returns

`undefined` \| [`number`, `number`]

## Defined in

[features/global-faceting/GlobalFaceting.utils.ts:6](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-faceting/GlobalFaceting.utils.ts#L6)

---
id: table_getGlobalFacetedUniqueValues
title: table_getGlobalFacetedUniqueValues
---

# Function: table\_getGlobalFacetedUniqueValues()

```ts
function table_getGlobalFacetedUniqueValues<TFeatures, TData>(table): () => Map<any, number>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

`Function`

### Returns

`Map`\<`any`, `number`\>

## Defined in

[features/global-faceting/GlobalFaceting.utils.ts:26](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-faceting/GlobalFaceting.utils.ts#L26)

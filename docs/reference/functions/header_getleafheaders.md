---
id: header_getLeafHeaders
title: header_getLeafHeaders
---

# Function: header\_getLeafHeaders()

```ts
function header_getLeafHeaders<TFeatures, TData, TValue>(header): Header<TFeatures, TData, TValue>[]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue**

## Parameters

• **header**: [`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

[`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`, `TValue`\>[]

## Defined in

[core/headers/Headers.utils.ts:15](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/Headers.utils.ts#L15)

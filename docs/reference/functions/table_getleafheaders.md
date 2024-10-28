---
id: table_getLeafHeaders
title: table_getLeafHeaders
---

# Function: table\_getLeafHeaders()

```ts
function table_getLeafHeaders<TFeatures, TData>(table): Header<TFeatures, TData, unknown>[]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

[`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Defined in

[core/headers/Headers.utils.ts:96](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/Headers.utils.ts#L96)

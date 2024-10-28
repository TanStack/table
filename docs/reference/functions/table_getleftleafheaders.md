---
id: table_getLeftLeafHeaders
title: table_getLeftLeafHeaders
---

# Function: table\_getLeftLeafHeaders()

```ts
function table_getLeftLeafHeaders<TFeatures, TData>(table): Header<TFeatures, TData, unknown>[]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

[`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Defined in

[features/column-pinning/ColumnPinning.utils.ts:312](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.utils.ts#L312)

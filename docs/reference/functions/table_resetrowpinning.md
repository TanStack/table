---
id: table_resetRowPinning
title: table_resetRowPinning
---

# Function: table\_resetRowPinning()

```ts
function table_resetRowPinning<TFeatures, TData>(table, defaultState?): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **defaultState?**: `boolean`

## Returns

`void`

## Defined in

[features/row-pinning/RowPinning.utils.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/RowPinning.utils.ts#L27)

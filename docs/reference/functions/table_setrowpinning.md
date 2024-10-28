---
id: table_setRowPinning
title: table_setRowPinning
---

# Function: table\_setRowPinning()

```ts
function table_setRowPinning<TFeatures, TData>(table, updater): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`RowPinningState`](../interfaces/rowpinningstate.md)\>

## Returns

`void`

## Defined in

[features/row-pinning/RowPinning.utils.ts:17](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/RowPinning.utils.ts#L17)

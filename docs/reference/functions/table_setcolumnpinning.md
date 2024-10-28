---
id: table_setColumnPinning
title: table_setColumnPinning
---

# Function: table\_setColumnPinning()

```ts
function table_setColumnPinning<TFeatures, TData>(table, updater): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`ColumnPinningState`](../interfaces/columnpinningstate.md)\>

## Returns

`void`

## Defined in

[features/column-pinning/ColumnPinning.utils.ts:161](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.utils.ts#L161)

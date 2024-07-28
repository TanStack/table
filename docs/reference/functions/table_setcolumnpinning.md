---
id: table_setColumnPinning
title: table_setColumnPinning
---

# Function: table\_setColumnPinning()

```ts
function table_setColumnPinning<TFeatures, TData>(table, updater): void
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`ColumnPinningState`](../interfaces/columnpinningstate.md)\>

## Returns

`void`

## Defined in

[features/column-pinning/ColumnPinning.utils.ts:147](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.utils.ts#L147)

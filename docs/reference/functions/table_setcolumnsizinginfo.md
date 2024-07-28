---
id: table_setColumnSizingInfo
title: table_setColumnSizingInfo
---

# Function: table\_setColumnSizingInfo()

```ts
function table_setColumnSizingInfo<TFeatures, TData>(table, updater): void
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`ColumnResizingInfoState`](../interfaces/columnresizinginfostate.md)\>

## Returns

`void`

## Defined in

[features/column-resizing/ColumnResizing.utils.ts:214](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-resizing/ColumnResizing.utils.ts#L214)

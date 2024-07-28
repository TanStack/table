---
id: table_setColumnSizing
title: table_setColumnSizing
---

# Function: table\_setColumnSizing()

```ts
function table_setColumnSizing<TFeatures, TData>(table, updater): void
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`ColumnSizingState`](../type-aliases/columnsizingstate.md)\>

## Returns

`void`

## Defined in

[features/column-sizing/ColumnSizing.utils.ts:112](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-sizing/ColumnSizing.utils.ts#L112)

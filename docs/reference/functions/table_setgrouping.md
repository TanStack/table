---
id: table_setGrouping
title: table_setGrouping
---

# Function: table\_setGrouping()

```ts
function table_setGrouping<TFeatures, TData>(table, updater): void
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`GroupingState`](../type-aliases/groupingstate.md)\>

## Returns

`void`

## Defined in

[features/column-grouping/ColumnGrouping.utils.ts:110](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-grouping/ColumnGrouping.utils.ts#L110)

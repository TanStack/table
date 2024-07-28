---
id: table_setColumnOrder
title: table_setColumnOrder
---

# Function: table\_setColumnOrder()

```ts
function table_setColumnOrder<TFeatures, TData>(table, updater): void
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`ColumnOrderState`](../type-aliases/columnorderstate.md)\>

## Returns

`void`

## Defined in

[features/column-ordering/ColumnOrdering.utils.ts:48](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-ordering/ColumnOrdering.utils.ts#L48)

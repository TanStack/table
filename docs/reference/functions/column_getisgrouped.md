---
id: column_getIsGrouped
title: column_getIsGrouped
---

# Function: column\_getIsGrouped()

```ts
function column_getIsGrouped<TFeatures, TData, TValue>(column, table): boolean
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Defined in

[features/column-grouping/ColumnGrouping.utils.ts:42](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-grouping/ColumnGrouping.utils.ts#L42)

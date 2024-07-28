---
id: column_getAutoAggregationFn
title: column_getAutoAggregationFn
---

# Function: column\_getAutoAggregationFn()

```ts
function column_getAutoAggregationFn<TFeatures, TData, TValue>(column, table): undefined | AggregationFn<any, any>
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

`undefined` \| [`AggregationFn`](../type-aliases/aggregationfn.md)\<`any`, `any`\>

## Defined in

[features/column-grouping/ColumnGrouping.utils.ts:77](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-grouping/ColumnGrouping.utils.ts#L77)

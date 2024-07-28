---
id: column_getAggregationFn
title: column_getAggregationFn
---

# Function: column\_getAggregationFn()

```ts
function column_getAggregationFn<TFeatures, TData, TValue>(column, table): undefined | AggregationFn<any, any> | AggregationFn<TableFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

`undefined` \| [`AggregationFn`](../type-aliases/aggregationfn.md)\<`any`, `any`\> \| [`AggregationFn`](../type-aliases/aggregationfn.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\>

## Defined in

[features/column-grouping/ColumnGrouping.utils.ts:95](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-grouping/ColumnGrouping.utils.ts#L95)

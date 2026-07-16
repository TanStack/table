---
id: AggregationValueResult
title: AggregationValueResult
---

# Interface: AggregationValueResult\<TResult\>

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:326](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L326)

Marks an aggregation-value override as handled.

## Type Parameters

### TResult

`TResult` = `unknown`

## Properties

### value

```ts
value: TResult;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:328](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L328)

The supplied value. `undefined` is still a handled result.

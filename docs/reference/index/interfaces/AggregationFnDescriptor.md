---
id: AggregationFnDescriptor
title: AggregationFnDescriptor
---

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:114](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L114)

Gives an aggregation reference a stable key in a multiple result.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` = `unknown`

### TResult

`TResult` = `unknown`

## Properties

### aggregationFn

```ts
aggregationFn: AggregationFnRef<TFeatures, TData, TValue, TResult>;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:121](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L121)

The named, automatic, or inline definition to execute.

***

### id

```ts
id: string;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:123](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L123)

Stable key used in the object returned by a multiple aggregation.

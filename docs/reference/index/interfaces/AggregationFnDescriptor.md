---
id: AggregationFnDescriptor
title: AggregationFnDescriptor
---

# Interface: AggregationFnDescriptor\<TFeatures, TData, TValue, TResult\>

Defined in: [features/aggregation/aggregationFeature.types.ts:120](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L120)

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

Defined in: [features/aggregation/aggregationFeature.types.ts:127](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L127)

The named, automatic, or inline definition to execute.

***

### id

```ts
id: string;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:129](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L129)

Stable key used in the object returned by a multiple aggregation.

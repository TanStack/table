---
id: AggregationFnDef
title: AggregationFnDef
---

# Interface: AggregationFnDef\<TFeatures, TData, TValue, TResult\>

Defined in: [features/aggregation/aggregationFeature.types.ts:54](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L54)

A context-based aggregation definition and optional grouped-result merge.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md) = `any`

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

### TValue

`TValue` = `unknown`

### TResult

`TResult` = `unknown`

## Properties

### aggregate()

```ts
aggregate: (context) => TResult;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:61](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L61)

Computes a result directly from normalized terminal rows.

#### Parameters

##### context

[`AggregationContext`](AggregationContext.md)\<`TFeatures`, `TData`, `TValue`\>

#### Returns

`TResult`

***

### merge()?

```ts
optional merge: (context) => TResult;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:66](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L66)

Combines already-computed immediate child-group results. When omitted,
nested grouping falls back to `aggregate` over the group's terminal rows.

#### Parameters

##### context

[`AggregationMergeContext`](AggregationMergeContext.md)\<`TFeatures`, `TData`, `TValue`, `TResult`\>

#### Returns

`TResult`

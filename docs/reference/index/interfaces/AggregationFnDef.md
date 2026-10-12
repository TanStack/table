---
id: AggregationFnDef
title: AggregationFnDef
---

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:63](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L63)

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

### aggregate

```ts
aggregate: (context) => TResult;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:70](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L70)

Computes a result directly from the selected `rows`.

#### Parameters

##### context

[`AggregationContext`](AggregationContext.md)\<`TFeatures`, `TData`, `TValue`\>

#### Returns

`TResult`

***

### merge?

```ts
optional merge?: (context) => TResult;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L75)

Combines already-computed immediate sub-row results. When omitted,
nested grouping falls back to `aggregate` over the group's selected rows.

#### Parameters

##### context

[`AggregationMergeContext`](AggregationMergeContext.md)\<`TFeatures`, `TData`, `TValue`, `TResult`\>

#### Returns

`TResult`

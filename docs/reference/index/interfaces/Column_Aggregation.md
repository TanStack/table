---
id: Column_Aggregation
title: Column_Aggregation
---

# Interface: Column\_Aggregation\<TFeatures, TData\>

Defined in: [features/aggregation/aggregationFeature.types.ts:250](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L250)

Column instance APIs installed by `aggregationFeature`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getAggregationFns()

```ts
getAggregationFns: () => readonly ResolvedAggregationFn<TFeatures, TData>[];
```

Defined in: [features/aggregation/aggregationFeature.types.ts:255](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L255)

Resolves the configured scalar or multiple aggregation definitions.

#### Returns

readonly [`ResolvedAggregationFn`](ResolvedAggregationFn.md)\<`TFeatures`, `TData`\>[]

***

### getAggregationValue()

```ts
getAggregationValue: <TResult>(rows?) => TResult;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:263](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L263)

Aggregates this column over the default pre-grouped row model, or over a
caller-provided array of rows. Explicit rows are normalized to unique
terminal leaves and are intentionally not cached.

#### Type Parameters

##### TResult

`TResult` = [`ColumnAggregationValue`](../type-aliases/ColumnAggregationValue.md)\<`TFeatures`\>

#### Parameters

##### rows?

readonly [`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

#### Returns

`TResult`

***

### getAutoAggregationFn()

```ts
getAutoAggregationFn: () => 
  | AggregationFnDef<TFeatures, TData, any, any>
  | undefined;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:267](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L267)

Infers `sum` for a numeric first row and `extent` for a Date first row.

#### Returns

  \| [`AggregationFnDef`](AggregationFnDef.md)\<`TFeatures`, `TData`, `any`, `any`\>
  \| `undefined`

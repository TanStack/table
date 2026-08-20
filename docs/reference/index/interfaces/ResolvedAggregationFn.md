---
id: ResolvedAggregationFn
title: ResolvedAggregationFn
---

# Interface: ResolvedAggregationFn\<TFeatures, TData\>

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:222](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L222)

A validated aggregation entry returned by `column.getAggregationFns()`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### aggregationFn

```ts
aggregationFn:
  | AggregationFnDef<TFeatures, TData, any, any>
  | undefined;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:227](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L227)

Resolved definition, or `undefined` when configuration is invalid.

***

### id

```ts
id: string | undefined;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:229](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L229)

Key used for a multiple result; scalar inline definitions have no id.

---
id: ResolvedAggregationFn
title: ResolvedAggregationFn
---

# Interface: ResolvedAggregationFn\<TFeatures, TData\>

Defined in: [features/aggregation/aggregationFeature.types.ts:214](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L214)

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

Defined in: [features/aggregation/aggregationFeature.types.ts:219](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L219)

Resolved definition, or `undefined` when configuration is invalid.

***

### id

```ts
id: string | undefined;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:221](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L221)

Key used for a multiple result; scalar inline definitions have no id.

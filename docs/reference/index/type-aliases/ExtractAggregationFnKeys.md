---
id: ExtractAggregationFnKeys
title: ExtractAggregationFnKeys
---

# Type Alias: ExtractAggregationFnKeys\<TFeatures\>

```ts
type ExtractAggregationFnKeys<TFeatures> = IsAny<TFeatures> extends true ?
  | keyof AggregationFns
  | BuiltInAggregationFn : TFeatures extends object ? Extract<keyof TAggregationFns, string> : keyof AggregationFns;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:109](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L109)

String names available from a feature set's aggregation registry.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

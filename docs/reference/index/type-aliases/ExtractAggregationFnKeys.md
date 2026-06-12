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

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:53](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L53)

Resolves the valid string names for `columnDef.aggregationFn` for a feature
set.

When the features object declares an `aggregationFns` registry
(`tableFeatures({ ..., aggregationFns })`), its keys are the only valid
names; a name is only assignable if an aggregation function is actually
registered for it. Otherwise this falls back to the global
declaration-merged `AggregationFns` interface.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

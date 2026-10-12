---
id: AggregationResultOf
title: AggregationResultOf
---

```ts
type AggregationResultOf<TDefinition> = TDefinition extends AggregationFnDef<any, any, any, infer TResult> ? TResult : unknown;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:146](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L146)

Extracts the result type produced by an aggregation definition.

## Type Parameters

### TDefinition

`TDefinition`

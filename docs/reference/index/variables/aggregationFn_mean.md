---
id: aggregationFn_mean
title: aggregationFn_mean
---

# Variable: aggregationFn\_mean

```ts
const aggregationFn_mean: AggregationFnDef<any, any, unknown, number | undefined>;
```

Defined in: [features/aggregation/aggregationFns.ts:192](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFns.ts#L192)

Averages number and number-like row values. Nullish and non-numeric values
are ignored; other values retain the legacy unary-plus coercion behavior.

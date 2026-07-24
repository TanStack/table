---
id: aggregationFn_mean
title: aggregationFn_mean
---

# Variable: aggregationFn\_mean

```ts
const aggregationFn_mean: AggregationFnDef<any, any, unknown, number | undefined>;
```

Defined in: [features/row-aggregation/aggregationFns.ts:235](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/aggregationFns.ts#L235)

Averages number and number-like row values. Nullish and non-numeric values
are ignored; other values retain the legacy unary-plus coercion behavior.

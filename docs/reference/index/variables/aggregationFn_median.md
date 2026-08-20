---
id: aggregationFn_median
title: aggregationFn_median
---

# Variable: aggregationFn\_median

```ts
const aggregationFn_median: AggregationFnDef<any, any, unknown, number | undefined>;
```

Defined in: [features/row-aggregation/aggregationFns.ts:263](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/aggregationFns.ts#L263)

Computes the median of the numeric row values. Non-numeric values are
ignored, matching the `sum`/`min`/`max`/`mean` aggregations. Returns
`undefined` when no numeric values remain.

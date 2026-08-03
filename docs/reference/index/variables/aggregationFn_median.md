---
id: aggregationFn_median
title: aggregationFn_median
---

# Variable: aggregationFn\_median

```ts
const aggregationFn_median: AggregationFnDef<any, any, unknown, number | undefined>;
```

Defined in: [features/row-aggregation/aggregationFns.ts:262](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/aggregationFns.ts#L262)

Computes the median when every row value is a number. Returns `undefined`
for empty inputs or when any value is non-numeric.

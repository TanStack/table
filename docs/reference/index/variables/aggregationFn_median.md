---
id: aggregationFn_median
title: aggregationFn_median
---

# Variable: aggregationFn\_median

```ts
const aggregationFn_median: AggregationFnDef<any, any, unknown, number | undefined>;
```

Defined in: [features/aggregation/aggregationFns.ts:227](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFns.ts#L227)

Computes the median when every row value is a number. Returns `undefined`
for empty inputs or when any value is non-numeric.

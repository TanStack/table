---
id: aggregationFn_sum
title: aggregationFn_sum
---

# Variable: aggregationFn\_sum

```ts
const aggregationFn_sum: AggregationFnDef<any, any, unknown, number>;
```

Defined in: [features/aggregation/aggregationFns.ts:45](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFns.ts#L45)

Sums numeric selected-row values. Non-number values contribute zero. As in
the previous API, `NaN` is a number and therefore propagates through the sum.

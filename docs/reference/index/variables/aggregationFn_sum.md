---
id: aggregationFn_sum
title: aggregationFn_sum
---

# Variable: aggregationFn\_sum

```ts
const aggregationFn_sum: CreatedAggregationFn<any, any>;
```

Defined in: [fns/aggregationFns.ts:68](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L68)

Sums numeric child-row values for a grouped column.

Non-number values contribute `0`. Child rows are used so nested group totals
can reuse already aggregated values.

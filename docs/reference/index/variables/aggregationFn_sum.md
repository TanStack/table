---
id: aggregationFn_sum
title: aggregationFn_sum
---

# Variable: aggregationFn\_sum

```ts
const aggregationFn_sum: AggregationFn<any, any>;
```

Defined in: [fns/aggregationFns.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L12)

Sums numeric child-row values for a grouped column.

Non-number values contribute `0`. Child rows are used so nested group totals
can reuse already aggregated values.

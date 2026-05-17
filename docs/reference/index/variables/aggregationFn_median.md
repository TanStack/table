---
id: aggregationFn_median
title: aggregationFn_median
---

# Variable: aggregationFn\_median

```ts
const aggregationFn_median: AggregationFn<any, any>;
```

Defined in: [fns/aggregationFns.ts:162](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L162)

Computes the median of numeric leaf-row values for a grouped column.

All values must be numbers. If any value is non-numeric, or no leaf rows are
present, the result is `undefined`.

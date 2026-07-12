---
id: aggregationFn_max
title: aggregationFn_max
---

# Variable: aggregationFn\_max

```ts
const aggregationFn_max: CreatedAggregationFn<any, any>;
```

Defined in: [fns/aggregationFns.ts:111](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L111)

Finds the maximum numeric child-row value for a grouped column.

Nullish and non-number values are ignored. Returns `undefined` when no
numeric value is found.

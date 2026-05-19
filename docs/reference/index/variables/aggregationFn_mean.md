---
id: aggregationFn_mean
title: aggregationFn_mean
---

# Variable: aggregationFn\_mean

```ts
const aggregationFn_mean: AggregationFn<any, any>;
```

Defined in: [fns/aggregationFns.ts:127](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L127)

Averages numeric leaf-row values for a grouped column.

Number-like values are coerced with unary `+`; nullish and non-numeric values
are ignored.

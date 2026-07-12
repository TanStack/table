---
id: aggregationFn_mean
title: aggregationFn_mean
---

# Variable: aggregationFn\_mean

```ts
const aggregationFn_mean: CreatedAggregationFn<any, any>;
```

Defined in: [fns/aggregationFns.ts:164](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L164)

Averages numeric leaf-row values for a grouped column.

Number-like values are coerced with unary `+`; nullish and non-numeric values
are ignored.

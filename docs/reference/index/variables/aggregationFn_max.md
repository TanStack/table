---
id: aggregationFn_max
title: aggregationFn_max
---

# Variable: aggregationFn\_max

```ts
const aggregationFn_max: AggregationFnDef<any, any, unknown, RangeValue | undefined>;
```

Defined in: [features/row-aggregation/aggregationFns.ts:112](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/aggregationFns.ts#L112)

Finds the maximum numeric or Date value from the selected rows. Invalid value
types are ignored; `NaN` preserves the legacy numeric seeding behavior.

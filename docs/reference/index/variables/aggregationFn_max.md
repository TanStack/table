---
id: aggregationFn_max
title: aggregationFn_max
---

# Variable: aggregationFn\_max

```ts
const aggregationFn_max: AggregationFnDef<any, any, unknown, RangeValue | undefined>;
```

Defined in: [features/aggregation/aggregationFns.ts:109](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFns.ts#L109)

Finds the maximum numeric or Date value from the selected rows. Invalid value
types are ignored; `NaN` preserves the legacy numeric seeding behavior.

---
id: aggregationFn_min
title: aggregationFn_min
---

# Variable: aggregationFn\_min

```ts
const aggregationFn_min: AggregationFnDef<any, any, unknown, RangeValue | undefined>;
```

Defined in: [features/row-aggregation/aggregationFns.ts:63](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/aggregationFns.ts#L63)

Finds the minimum numeric or Date value from the selected rows. Invalid value
types are ignored; `NaN` preserves the legacy numeric seeding behavior.

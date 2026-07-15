---
id: aggregationFn_extent
title: aggregationFn_extent
---

# Variable: aggregationFn\_extent

```ts
const aggregationFn_extent: AggregationFnDef<any, any, unknown, [RangeValue | undefined, RangeValue | undefined]>;
```

Defined in: [features/aggregation/aggregationFns.ts:146](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFns.ts#L146)

Finds the minimum and maximum numeric or Date values from the selected rows.
Empty inputs return
`[undefined, undefined]`, preserving the previous built-in result shape.

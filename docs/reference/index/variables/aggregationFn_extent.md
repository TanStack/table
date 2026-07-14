---
id: aggregationFn_extent
title: aggregationFn_extent
---

# Variable: aggregationFn\_extent

```ts
const aggregationFn_extent: AggregationFnDef<any, any, unknown, [RangeValue | undefined, RangeValue | undefined]>;
```

Defined in: [features/aggregation/aggregationFns.ts:143](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFns.ts#L143)

Finds the minimum and maximum numeric or Date values. Empty inputs return
`[undefined, undefined]`, preserving the previous built-in result shape.

---
id: aggregationFn_extent
title: aggregationFn_extent
---

# Variable: aggregationFn\_extent

```ts
const aggregationFn_extent: AggregationFn<any, any>;
```

Defined in: [fns/aggregationFns.ts:95](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L95)

Finds the numeric extent for a grouped column.

Returns `[min, max]`, where each entry is `undefined` when no numeric value is
present.

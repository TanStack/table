---
id: aggregationFn_extent
title: aggregationFn_extent
---

# Variable: aggregationFn\_extent

```ts
const aggregationFn_extent: CreatedAggregationFn<any, any>;
```

Defined in: [fns/aggregationFns.ts:136](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L136)

Finds the numeric extent for a grouped column.

Returns `[min, max]`, where each entry is `undefined` when no numeric value is
present.

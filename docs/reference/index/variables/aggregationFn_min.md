---
id: aggregationFn_min
title: aggregationFn_min
---

# Variable: aggregationFn\_min

```ts
const aggregationFn_min: CreatedAggregationFn<any, any>;
```

Defined in: [fns/aggregationFns.ts:86](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L86)

Finds the minimum numeric child-row value for a grouped column.

Nullish and non-number values are ignored. Returns `undefined` when no
numeric value is found.

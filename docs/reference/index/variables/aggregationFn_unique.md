---
id: aggregationFn_unique
title: aggregationFn_unique
---

# Variable: aggregationFn\_unique

```ts
const aggregationFn_unique: CreatedAggregationFn<any, any>;
```

Defined in: [fns/aggregationFns.ts:222](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L222)

Collects unique leaf-row values for a grouped column.

Values are compared with JavaScript `Set` semantics.

---
id: filterFn_equals
title: filterFn_equals
---

# Variable: filterFn\_equals

```ts
const filterFn_equals: CreatedFilterFn<any, any>;
```

Defined in: [features/column-filtering/filterFns.ts:77](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/filterFns.ts#L77)

Keeps rows whose column value is strictly equal to the filter value.

Uses JavaScript `===` comparison and auto-removes empty filter values.

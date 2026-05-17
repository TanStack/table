---
id: filterFn_equals
title: filterFn_equals
---

# Variable: filterFn\_equals

```ts
const filterFn_equals: FilterFn<any, any>;
```

Defined in: [fns/filterFns.ts:13](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L13)

Keeps rows whose column value is strictly equal to the filter value.

Uses JavaScript `===` comparison and auto-removes empty filter values.

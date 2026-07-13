---
id: filterFn_weakEquals
title: filterFn_weakEquals
---

# Variable: filterFn\_weakEquals

```ts
const filterFn_weakEquals: CreatedFilterFn<any, any>;
```

Defined in: [fns/filterFns.ts:88](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L88)

Keeps rows whose column value is loosely equal to the filter value.

Uses JavaScript `==` comparison and auto-removes empty filter values. This is
useful for matching string input against numeric row values.

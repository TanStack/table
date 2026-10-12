---
id: filterFn_weakEquals
title: filterFn_weakEquals
---

```ts
const filterFn_weakEquals: CreatedFilterFn<any, any>;
```

Defined in: [features/column-filtering/filterFns.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/filterFns.ts#L89)

Keeps rows whose column value is loosely equal to the filter value.

Uses JavaScript `==` comparison and auto-removes empty filter values. This is
useful for matching string input against numeric row values.

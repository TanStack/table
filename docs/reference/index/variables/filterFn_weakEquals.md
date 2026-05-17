---
id: filterFn_weakEquals
title: filterFn_weakEquals
---

# Variable: filterFn\_weakEquals

```ts
const filterFn_weakEquals: FilterFn<any, any>;
```

Defined in: [fns/filterFns.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L32)

Keeps rows whose column value is loosely equal to the filter value.

Uses JavaScript `==` comparison and auto-removes empty filter values. This is
useful for matching string input against numeric row values.

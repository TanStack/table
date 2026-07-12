---
id: filterFn_greaterThan
title: filterFn_greaterThan
---

# Variable: filterFn\_greaterThan

```ts
const filterFn_greaterThan: CreatedFilterFn<any, any>;
```

Defined in: [fns/filterFns.ts:210](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L210)

Keeps rows whose value is greater than the filter value.

Numeric values are compared numerically when both sides can be coerced to
numbers; otherwise normalized strings are compared.

---
id: filterFn_notEmpty
title: filterFn_notEmpty
---

# Variable: filterFn\_notEmpty

```ts
const filterFn_notEmpty: CreatedFilterFn<any, any>;
```

Defined in: [fns/filterFns.ts:197](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L197)

Keeps rows whose column value is not empty.

A value is empty when it is nullish or stringifies to whitespace only. The
filter value acts as an on/off flag: `false` and blank values are
auto-removed.

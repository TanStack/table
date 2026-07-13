---
id: filterFn_empty
title: filterFn_empty
---

# Variable: filterFn\_empty

```ts
const filterFn_empty: CreatedFilterFn<any, any>;
```

Defined in: [fns/filterFns.ts:185](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L185)

Keeps rows whose column value is empty.

A value is empty when it is nullish or stringifies to whitespace only. The
filter value acts as an on/off flag: `false` and blank values are
auto-removed.

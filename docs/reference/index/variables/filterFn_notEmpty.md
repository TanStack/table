---
id: filterFn_notEmpty
title: filterFn_notEmpty
---

```ts
const filterFn_notEmpty: CreatedFilterFn<any, any>;
```

Defined in: [features/column-filtering/filterFns.ts:202](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/filterFns.ts#L202)

Keeps rows whose column value is not empty.

A value is empty when it is nullish or stringifies to whitespace only. The
filter value acts as an on/off flag: `false` and blank values are
auto-removed.

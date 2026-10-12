---
id: filterFn_includesStringSensitive
title: filterFn_includesStringSensitive
---

```ts
const filterFn_includesStringSensitive: CreatedFilterFn<any, any>;
```

Defined in: [features/column-filtering/filterFns.ts:101](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/filterFns.ts#L101)

Keeps rows whose stringified column value includes the filter text.

Matching is case-sensitive and empty filter values are auto-removed.

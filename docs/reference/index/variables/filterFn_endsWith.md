---
id: filterFn_endsWith
title: filterFn_endsWith
---

```ts
const filterFn_endsWith: CreatedFilterFn<any, any>;
```

Defined in: [features/column-filtering/filterFns.ts:173](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/filterFns.ts#L173)

Keeps rows whose stringified column value ends with the filter text.

Both values are lowercased before comparison, and empty filter values are
auto-removed.

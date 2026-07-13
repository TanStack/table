---
id: filterFn_endsWith
title: filterFn_endsWith
---

# Variable: filterFn\_endsWith

```ts
const filterFn_endsWith: CreatedFilterFn<any, any>;
```

Defined in: [fns/filterFns.ts:168](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L168)

Keeps rows whose stringified column value ends with the filter text.

Both values are lowercased before comparison, and empty filter values are
auto-removed.

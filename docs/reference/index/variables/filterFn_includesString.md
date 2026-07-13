---
id: filterFn_includesString
title: filterFn_includesString
---

# Variable: filterFn\_includesString

```ts
const filterFn_includesString: CreatedFilterFn<any, any>;
```

Defined in: [fns/filterFns.ts:113](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L113)

Keeps rows whose stringified column value includes the filter text.

Both values are lowercased before comparison, and empty filter values are
auto-removed.

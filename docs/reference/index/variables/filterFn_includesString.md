---
id: filterFn_includesString
title: filterFn_includesString
---

# Variable: filterFn\_includesString

```ts
const filterFn_includesString: FilterFn<any, any>;
```

Defined in: [fns/filterFns.ts:73](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L73)

Keeps rows whose stringified column value includes the filter text.

Both values are lowercased before comparison, and empty filter values are
auto-removed.

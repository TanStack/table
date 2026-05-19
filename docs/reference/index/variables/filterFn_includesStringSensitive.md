---
id: filterFn_includesStringSensitive
title: filterFn_includesStringSensitive
---

# Variable: filterFn\_includesStringSensitive

```ts
const filterFn_includesStringSensitive: FilterFn<any, any>;
```

Defined in: [fns/filterFns.ts:52](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L52)

Keeps rows whose stringified column value includes the filter text.

Matching is case-sensitive and empty filter values are auto-removed.

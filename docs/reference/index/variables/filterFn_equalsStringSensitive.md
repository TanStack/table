---
id: filterFn_equalsStringSensitive
title: filterFn_equalsStringSensitive
---

# Variable: filterFn\_equalsStringSensitive

```ts
const filterFn_equalsStringSensitive: FilterFn<any, any>;
```

Defined in: [fns/filterFns.ts:119](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L119)

Keeps rows whose stringified column value exactly equals the filter text.

Matching is case-sensitive and empty filter values are auto-removed.

---
id: filterFn_equalsStringSensitive
title: filterFn_equalsStringSensitive
---

# Variable: filterFn\_equalsStringSensitive

```ts
const filterFn_equalsStringSensitive: CreatedFilterFn<any, any>;
```

Defined in: [features/column-filtering/filterFns.ts:140](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/filterFns.ts#L140)

Keeps rows whose stringified column value exactly equals the filter text.

Matching is case-sensitive and empty filter values are auto-removed.

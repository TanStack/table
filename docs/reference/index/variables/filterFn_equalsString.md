---
id: filterFn_equalsString
title: filterFn_equalsString
---

```ts
const filterFn_equalsString: CreatedFilterFn<any, any>;
```

Defined in: [features/column-filtering/filterFns.ts:130](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/filterFns.ts#L130)

Keeps rows whose stringified column value equals the filter text.

Both values are lowercased before comparison, and empty filter values are
auto-removed.

---
id: filterFn_startsWith
title: filterFn_startsWith
---

# Variable: filterFn\_startsWith

```ts
const filterFn_startsWith: CreatedFilterFn<any, any>;
```

Defined in: [features/column-filtering/filterFns.ts:153](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/filterFns.ts#L153)

Keeps rows whose stringified column value starts with the filter text.

Both values are lowercased before comparison, and empty filter values are
auto-removed.

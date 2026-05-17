---
id: filterFn_equalsString
title: filterFn_equalsString
---

# Variable: filterFn\_equalsString

```ts
const filterFn_equalsString: FilterFn<any, any>;
```

Defined in: [fns/filterFns.ts:98](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L98)

Keeps rows whose stringified column value equals the filter text.

Both values are lowercased before comparison, and empty filter values are
auto-removed.

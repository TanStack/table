---
id: filterFn_equalsString
title: filterFn_equalsString
---

# Variable: filterFn\_equalsString

```ts
const filterFn_equalsString: CreatedFilterFn<any, any>;
```

Defined in: [fns/filterFns.ts:127](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L127)

Keeps rows whose stringified column value equals the filter text.

Both values are lowercased before comparison, and empty filter values are
auto-removed.

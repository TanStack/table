---
id: filterFn_equalsStringSensitive
title: filterFn_equalsStringSensitive
---

# Variable: filterFn\_equalsStringSensitive

```ts
const filterFn_equalsStringSensitive: <TFeatures, TData>(row, columnId, filterValue) => boolean & object;
```

Defined in: [fns/filterFns.ts:108](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L108)

Keeps rows whose stringified column value exactly equals the filter text.

Matching is case-sensitive and empty filter values are auto-removed.

## Type Declaration

### autoRemove()

```ts
autoRemove: (val) => boolean;
```

#### Parameters

##### val

`any`

#### Returns

`boolean`

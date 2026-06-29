---
id: filterFn_includesStringSensitive
title: filterFn_includesStringSensitive
---

# Variable: filterFn\_includesStringSensitive

```ts
const filterFn_includesStringSensitive: <TFeatures, TData>(row, columnId, filterValue) => boolean & object;
```

Defined in: [fns/filterFns.ts:47](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L47)

Keeps rows whose stringified column value includes the filter text.

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

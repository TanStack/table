---
id: filterFn_arrIncludesAll
title: filterFn_arrIncludesAll
---

# Variable: filterFn\_arrIncludesAll

```ts
const filterFn_arrIncludesAll: <TFeatures, TData>(row, columnId, filterValue) => boolean & object;
```

Defined in: [fns/filterFns.ts:331](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L331)

Keeps rows whose array column value includes every filter value.

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

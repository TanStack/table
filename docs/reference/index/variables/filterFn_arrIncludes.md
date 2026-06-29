---
id: filterFn_arrIncludes
title: filterFn_arrIncludes
---

# Variable: filterFn\_arrIncludes

```ts
const filterFn_arrIncludes: <TFeatures, TData>(row, columnId, filterValue) => boolean & object;
```

Defined in: [fns/filterFns.ts:313](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L313)

Keeps rows whose array or string column value includes at least one filter value.

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

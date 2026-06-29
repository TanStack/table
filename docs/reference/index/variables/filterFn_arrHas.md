---
id: filterFn_arrHas
title: filterFn_arrHas
---

# Variable: filterFn\_arrHas

```ts
const filterFn_arrHas: <TFeatures, TData>(row, columnId, filterValue) => boolean & object;
```

Defined in: [fns/filterFns.ts:299](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L299)

Keeps rows whose scalar column value equals at least one filter value.

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

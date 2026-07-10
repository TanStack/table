---
id: filterFn_arrIncludesSome
title: filterFn_arrIncludesSome
---

# Variable: filterFn\_arrIncludesSome

```ts
const filterFn_arrIncludesSome: <TFeatures, TData>(row, columnId, filterValue) => boolean & object;
```

Defined in: [fns/filterFns.ts:406](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L406)

Keeps rows whose array column value includes at least one filter value.

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

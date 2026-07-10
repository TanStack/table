---
id: filterFn_includesString
title: filterFn_includesString
---

# Variable: filterFn\_includesString

```ts
const filterFn_includesString: <TFeatures, TData>(row, columnId, filterValue) => boolean & object;
```

Defined in: [fns/filterFns.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L69)

Keeps rows whose stringified column value includes the filter text.

Both values are lowercased before comparison, and empty filter values are
auto-removed.

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

### resolveFilterValue()

```ts
resolveFilterValue: (val) => string;
```

#### Parameters

##### val

`any`

#### Returns

`string`

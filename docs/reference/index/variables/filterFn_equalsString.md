---
id: filterFn_equalsString
title: filterFn_equalsString
---

# Variable: filterFn\_equalsString

```ts
const filterFn_equalsString: <TFeatures, TData>(row, columnId, filterValue) => boolean & object;
```

Defined in: [fns/filterFns.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L89)

Keeps rows whose stringified column value equals the filter text.

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

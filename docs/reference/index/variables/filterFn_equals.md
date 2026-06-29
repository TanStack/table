---
id: filterFn_equals
title: filterFn_equals
---

# Variable: filterFn\_equals

```ts
const filterFn_equals: <TFeatures, TData>(row, columnId, filterValue) => boolean & object;
```

Defined in: [fns/filterFns.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L12)

Keeps rows whose column value is strictly equal to the filter value.

Uses JavaScript `===` comparison and auto-removes empty filter values.

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

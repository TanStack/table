---
id: filterFn_lessThan
title: filterFn_lessThan
---

# Variable: filterFn\_lessThan

```ts
const filterFn_lessThan: <TFeatures, TData>(row, columnId, filterValue) => boolean & object;
```

Defined in: [fns/filterFns.ts:173](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L173)

Keeps rows whose value is less than the filter value.

This is implemented as the inverse of greater-than-or-equal comparison.

## Type Declaration

### resolveFilterValue()

```ts
resolveFilterValue: (val) => boolean;
```

#### Parameters

##### val

`any`

#### Returns

`boolean`

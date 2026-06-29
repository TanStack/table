---
id: filterFn_lessThanOrEqualTo
title: filterFn_lessThanOrEqualTo
---

# Variable: filterFn\_lessThanOrEqualTo

```ts
const filterFn_lessThanOrEqualTo: <TFeatures, TData>(row, columnId, filterValue) => boolean & object;
```

Defined in: [fns/filterFns.ts:189](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L189)

Keeps rows whose value is less than or equal to the filter value.

This is implemented as the inverse of greater-than comparison.

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

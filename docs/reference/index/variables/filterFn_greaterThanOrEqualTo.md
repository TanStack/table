---
id: filterFn_greaterThanOrEqualTo
title: filterFn_greaterThanOrEqualTo
---

# Variable: filterFn\_greaterThanOrEqualTo

```ts
const filterFn_greaterThanOrEqualTo: <TFeatures, TData>(row, columnId, filterValue) => boolean & object;
```

Defined in: [fns/filterFns.ts:154](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L154)

Keeps rows whose value is greater than or equal to the filter value.

Delegates to the built-in greater-than and equality comparisons.

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

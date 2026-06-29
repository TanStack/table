---
id: filterFn_greaterThan
title: filterFn_greaterThan
---

# Variable: filterFn\_greaterThan

```ts
const filterFn_greaterThan: <TFeatures, TData>(row, columnId, filterValue) => boolean & object;
```

Defined in: [fns/filterFns.ts:127](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L127)

Keeps rows whose value is greater than the filter value.

Numeric values are compared numerically when both sides can be coerced to
numbers; otherwise normalized strings are compared.

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

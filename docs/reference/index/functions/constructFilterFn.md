---
id: constructFilterFn
title: constructFilterFn
---

# Function: constructFilterFn()

```ts
function constructFilterFn<TFeatures, TData>(def): CreatedFilterFn<TFeatures, TData>;
```

Defined in: [features/column-filtering/filterFns.ts:40](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/filterFns.ts#L40)

Builds a `FilterFn` from a value-level comparator plus optional resolvers.

The `filter` comparator receives the row's data value (already passed
through `resolveDataValue` when one is defined) and the filter value
(already passed through `resolveFilterValue` by the table). Keeping
normalization in the resolvers means a variant of an existing filter
function only has to swap the resolvers, not re-implement the comparison.

The definition is attached to the returned function, so a variant can be
created by spreading a built-in filter function and overriding what differs:

```ts
const normalize = (value: unknown) =>
  String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')

const includesStringIgnoreDiacritics = constructFilterFn({
  ...filterFn_includesString,
  resolveFilterValue: normalize,
  resolveDataValue: normalize,
})
```

Note: the table applies `resolveFilterValue` once per filter before any rows
are tested. When calling a filter function directly (outside of a table),
apply it yourself: `fn(row, columnId, fn.resolveFilterValue?.(value) ?? value)`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md) = `any`

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

## Parameters

### def

[`FilterFnDef`](../interfaces/FilterFnDef.md)\<`TFeatures`, `TData`\>

## Returns

[`CreatedFilterFn`](../interfaces/CreatedFilterFn.md)\<`TFeatures`, `TData`\>

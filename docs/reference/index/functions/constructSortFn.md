---
id: constructSortFn
title: constructSortFn
---

# Function: constructSortFn()

```ts
function constructSortFn<TFeatures, TData>(def): CreatedSortFn<TFeatures, TData>;
```

Defined in: [fns/sortFns.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/sortFns.ts#L41)

Builds a `SortFn` from a value-level comparator plus an optional
`resolveDataValue` normalizer.

The `sort` comparator receives both rows' data values, each already passed
through `resolveDataValue` when one is defined. Keeping normalization in the
resolver means a variant of an existing sorting function only has to swap
the resolver, not re-implement the comparison.

The definition is attached to the returned function, so a variant can be
created by spreading a built-in sorting function and overriding what
differs:

```ts
const stripDiacritics = (value: string) =>
  value.normalize('NFD').replace(/\p{Diacritic}/gu, '')

const alphanumericIgnoreDiacritics = constructSortFn({
  ...sortFn_alphanumeric,
  resolveDataValue: (value) =>
    stripDiacritics(sortFn_alphanumeric.resolveDataValue!(value)),
})
```

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md) = `any`

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

## Parameters

### def

[`SortFnDef`](../interfaces/SortFnDef.md)\<`TFeatures`, `TData`\>

## Returns

[`CreatedSortFn`](../interfaces/CreatedSortFn.md)\<`TFeatures`, `TData`\>

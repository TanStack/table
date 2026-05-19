---
id: column_getAutoSortFn
title: column_getAutoSortFn
---

# Function: column\_getAutoSortFn()

```ts
function column_getAutoSortFn<TFeatures, TData, TValue>(column): SortFn<TFeatures, TData>;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:84](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L84)

Chooses a built-in sorting function from sampled filtered row values.

Date-like values use `datetime`, mixed text/numeric strings use
`alphanumeric`, plain strings use `text`, and unknown values fall back to
`basic`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../../index/type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

[`SortFn`](../../index/interfaces/SortFn.md)\<`TFeatures`, `TData`\>

## Example

```ts
const sortFn = column_getAutoSortFn(column)
```

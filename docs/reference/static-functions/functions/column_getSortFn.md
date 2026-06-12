---
id: column_getSortFn
title: column_getSortFn
---

# Function: column\_getSortFn()

```ts
function column_getSortFn<TFeatures, TData, TValue>(column): SortFn<TFeatures, TData>;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:162](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L162)

Resolves the sorting function configured for a column.

Function-valued `columnDef.sortFn` is returned directly, `'auto'` delegates
to `column_getAutoSortFn`, and string values are looked up in the table's
sorting function registry before falling back to `basic`.

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
const sortFn = column_getSortFn(column)
```

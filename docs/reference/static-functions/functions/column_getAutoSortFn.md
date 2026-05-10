---
id: column_getAutoSortFn
title: column_getAutoSortFn
---

# Function: column\_getAutoSortFn()

```ts
function column_getAutoSortFn<TFeatures, TData, TValue>(column): SortFn<TFeatures, TData>;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:79](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L79)

Infers sort fn for a column.

The inference uses the column definition, table options, and sampled row values when needed.

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
const value = column_getAutoSortFn(column)
```

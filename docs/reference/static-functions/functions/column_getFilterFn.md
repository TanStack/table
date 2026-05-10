---
id: column_getFilterFn
title: column_getFilterFn
---

# Function: column\_getFilterFn()

```ts
function column_getFilterFn<TFeatures, TData, TValue>(column): 
  | FilterFn<TFeatures, TData>
  | undefined;
```

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:80](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L80)

Returns filter fn for a column.

This derives the value from the column definition, table options, and the feature state atoms registered on the table.

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

  \| [`FilterFn`](../../index/interfaces/FilterFn.md)\<`TFeatures`, `TData`\>
  \| `undefined`

## Example

```ts
const value = column_getFilterFn(column)
```

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

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L85)

Resolves the filter function configured for a column.

Function-valued `columnDef.filterFn` is returned directly, `'auto'` delegates
to `column_getAutoFilterFn`, and string values are looked up in the table's
filter function registry.

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
const filterFn = column_getFilterFn(column)
```

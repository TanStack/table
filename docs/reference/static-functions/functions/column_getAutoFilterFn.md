---
id: column_getAutoFilterFn
title: column_getAutoFilterFn
---

# Function: column\_getAutoFilterFn()

```ts
function column_getAutoFilterFn<TFeatures, TData, TValue>(column): 
  | FilterFn<TFeatures, TData>
  | undefined;
```

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L38)

Chooses a built-in filter function from the column's first core row value.

Strings use `includesString`, numbers use `inNumberRange`, booleans and
objects use `equals`, arrays use `arrIncludes`, and unknown values fall back
to `weakEquals`.

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
const filterFn = column_getAutoFilterFn(column)
```

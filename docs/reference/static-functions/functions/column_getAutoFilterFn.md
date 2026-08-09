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

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:47](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L47)

Chooses a built-in filter function from the column's first core row value.

Strings use `includesString`, numbers use `inNumberRange`, booleans and
objects use `equals`, dates use `inDateRange`, arrays use `arrIncludes`,
and unknown values fall back to `weakEquals`.

The chosen filter function is looked up in the table's `filterFns`
registry. When it is not registered there, this returns `undefined` and
warns in development instead of substituting a different filter function.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../../index/interfaces/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

  \| [`FilterFn`](../../index/interfaces/FilterFn.md)\<`TFeatures`, `TData`\>
  \| `undefined`

## Example

```ts
const filterFn = column_getAutoFilterFn(column)
```

---
id: column_getCanFilter
title: column_getCanFilter
---

# Function: column\_getCanFilter()

```ts
function column_getCanFilter<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:121](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L121)

Checks whether column filtering is enabled for this accessor column.

The column must have an accessor and filtering must be enabled by the column
definition, `enableColumnFilters`, and the table-wide `enableFilters` option.

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

`boolean`

## Example

```ts
const canFilter = column_getCanFilter(column)
```

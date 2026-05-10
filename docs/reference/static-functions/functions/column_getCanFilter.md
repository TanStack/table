---
id: column_getCanFilter
title: column_getCanFilter
---

# Function: column\_getCanFilter()

```ts
function column_getCanFilter<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:115](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L115)

Returns whether a column can use filter.

This combines column options, table options, and any required accessor or feature state for the capability.

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
const value = column_getCanFilter(column)
```

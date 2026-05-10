---
id: column_getCanGlobalFilter
title: column_getCanGlobalFilter
---

# Function: column\_getCanGlobalFilter()

```ts
function column_getCanGlobalFilter<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/global-filtering/globalFilteringFeature.utils.ts:19](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.utils.ts#L19)

Returns whether a column can use global filter.

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
const value = column_getCanGlobalFilter(column)
```

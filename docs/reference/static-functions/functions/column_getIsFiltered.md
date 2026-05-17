---
id: column_getIsFiltered
title: column_getIsFiltered
---

# Function: column\_getIsFiltered()

```ts
function column_getIsFiltered<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:145](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L145)

Checks whether this column currently has an entry in `state.columnFilters`.

This only reflects filter state presence; it does not indicate whether the
filter removes any rows.

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
const isFiltered = column_getIsFiltered(column)
```

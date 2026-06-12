---
id: column_toggleSorting
title: column_toggleSorting
---

# Function: column\_toggleSorting()

```ts
function column_toggleSorting<TFeatures, TData, TValue>(
   column, 
   desc?, 
   multi?): void;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:189](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L189)

Applies the next sorting state for this column.

The toggle can add, replace, flip, or remove this column's sort entry. Multi
sorting respects `enableMultiSort`, `maxMultiSortColCount`, and the `multi`
argument.

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

### desc?

`boolean`

### multi?

`boolean`

## Returns

`void`

## Example

```ts
column_toggleSorting(column, undefined, true)
```

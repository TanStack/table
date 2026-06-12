---
id: column_clearSorting
title: column_clearSorting
---

# Function: column\_clearSorting()

```ts
function column_clearSorting<TFeatures, TData, TValue>(column): void;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:447](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L447)

Removes this column from the sorting state.

Other sorted columns are preserved, including their relative order.

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

`void`

## Example

```ts
column_clearSorting(column)
```

---
id: column_getToggleSortingHandler
title: column_getToggleSortingHandler
---

# Function: column\_getToggleSortingHandler()

```ts
function column_getToggleSortingHandler<TFeatures, TData, TValue>(column): (e) => void;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:470](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L470)

Creates a header event handler that toggles this column's sorting.

The handler ignores events when the column cannot sort, persists React-style
synthetic events when present, and asks `options.isMultiSortEvent` whether
the event should add to a multi-sort.

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

```ts
(e): void;
```

### Parameters

#### e

`unknown`

### Returns

`void`

## Example

```ts
const onClick = column_getToggleSortingHandler(column)
```

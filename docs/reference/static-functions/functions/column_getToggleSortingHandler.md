---
id: column_getToggleSortingHandler
title: column_getToggleSortingHandler
---

# Function: column\_getToggleSortingHandler()

```ts
function column_getToggleSortingHandler<TFeatures, TData, TValue>(column): (e) => void;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:451](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L451)

Returns an event handler for toggling sorting handler.

The handler is intended for direct use in column header controls such as buttons or checkboxes.

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
const value = column_getToggleSortingHandler(column)
```

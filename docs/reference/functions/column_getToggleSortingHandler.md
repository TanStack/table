---
id: column_getToggleSortingHandler
title: column_getToggleSortingHandler
---

# Function: column\_getToggleSortingHandler()

```ts
function column_getToggleSortingHandler<TFeatures, TData, TValue>(column): (e) => void;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:301](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L301)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

```ts
(e): void;
```

### Parameters

#### e

`unknown`

### Returns

`void`

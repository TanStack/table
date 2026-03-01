---
id: column_getCanMultiSort
title: column_getCanMultiSort
---

# Function: column\_getCanMultiSort()

```ts
function column_getCanMultiSort<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:257](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L257)

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

`boolean`

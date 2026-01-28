---
id: column_getCanSort
title: column_getCanSort
---

# Function: column\_getCanSort()

```ts
function column_getCanSort<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts:245](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L245)

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

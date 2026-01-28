---
id: column_getAutoSortFn
title: column_getAutoSortFn
---

# Function: column\_getAutoSortFn()

```ts
function column_getAutoSortFn<TFeatures, TData, TValue>(column): SortFn<TFeatures, TData>;
```

Defined in: [packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L38)

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

[`SortFn`](../interfaces/SortFn.md)\<`TFeatures`, `TData`\>

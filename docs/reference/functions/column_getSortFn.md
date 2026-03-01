---
id: column_getSortFn
title: column_getSortFn
---

# Function: column\_getSortFn()

```ts
function column_getSortFn<TFeatures, TData, TValue>(column): SortFn<TFeatures, TData>;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:92](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L92)

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

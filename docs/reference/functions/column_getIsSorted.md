---
id: column_getIsSorted
title: column_getIsSorted
---

# Function: column\_getIsSorted()

```ts
function column_getIsSorted<TFeatures, TData, TValue>(column): false | SortDirection;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:269](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L269)

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

`false` \| [`SortDirection`](../type-aliases/SortDirection.md)

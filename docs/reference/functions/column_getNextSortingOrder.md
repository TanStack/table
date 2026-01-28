---
id: column_getNextSortingOrder
title: column_getNextSortingOrder
---

# Function: column\_getNextSortingOrder()

```ts
function column_getNextSortingOrder<TFeatures, TData, TValue>(column, multi?): false | "asc" | "desc";
```

Defined in: [packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts:223](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L223)

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

### multi?

`boolean`

## Returns

`false` \| `"asc"` \| `"desc"`

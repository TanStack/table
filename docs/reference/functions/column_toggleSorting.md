---
id: column_toggleSorting
title: column_toggleSorting
---

# Function: column\_toggleSorting()

```ts
function column_toggleSorting<TFeatures, TData, TValue>(
   column, 
   desc?, 
   multi?): void;
```

Defined in: [packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts:108](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L108)

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

### desc?

`boolean`

### multi?

`boolean`

## Returns

`void`

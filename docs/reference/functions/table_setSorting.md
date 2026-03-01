---
id: table_setSorting
title: table_setSorting
---

# Function: table\_setSorting()

```ts
function table_setSorting<TFeatures, TData>(table, updater): void;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:19](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L19)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../type-aliases/Updater.md)\<[`SortingState`](../type-aliases/SortingState.md)\>

## Returns

`void`

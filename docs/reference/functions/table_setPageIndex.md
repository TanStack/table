---
id: table_setPageIndex
title: table_setPageIndex
---

# Function: table\_setPageIndex()

```ts
function table_setPageIndex<TFeatures, TData>(table, updater): void;
```

Defined in: [packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L55)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../type-aliases/Updater.md)\<`number`\>

## Returns

`void`

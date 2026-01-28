---
id: table_setPageSize
title: table_setPageSize
---

# Function: table\_setPageSize()

```ts
function table_setPageSize<TFeatures, TData>(table, updater): void;
```

Defined in: [packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts:101](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L101)

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

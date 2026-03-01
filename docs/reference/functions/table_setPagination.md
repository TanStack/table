---
id: table_setPagination
title: table_setPagination
---

# Function: table\_setPagination()

```ts
function table_setPagination<TFeatures, TData>(table, updater): void | undefined;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L30)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../type-aliases/Updater.md)\<[`PaginationState`](../interfaces/PaginationState.md)\>

## Returns

`void` \| `undefined`

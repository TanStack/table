---
id: table_setPageSize
title: table_setPageSize
---

# Function: table\_setPageSize()

```ts
function table_setPageSize<TFeatures, TData>(table, updater): void;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:199](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L199)

Updates `pagination.pageSize` while preserving the current top row.

The new size is clamped to at least `1`, and `pageIndex` is recalculated so
the row that was previously at the top of the page remains in view.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../../index/type-aliases/Updater.md)\<`number`\>

## Returns

`void`

## Example

```ts
table_setPageSize(table, (old) => old)
```

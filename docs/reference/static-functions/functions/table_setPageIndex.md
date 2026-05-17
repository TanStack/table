---
id: table_setPageIndex
title: table_setPageIndex
---

# Function: table\_setPageIndex()

```ts
function table_setPageIndex<TFeatures, TData>(table, updater): void;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:116](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L116)

Updates `pagination.pageIndex` and clamps it to the known page range.

Unknown page counts (`undefined` or `-1`) allow any non-negative page index.
Known page counts clamp the index between `0` and `pageCount - 1`.

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
table_setPageIndex(table, (old) => old)
```

---
id: table_firstPage
title: table_firstPage
---

# Function: table\_firstPage()

```ts
function table_firstPage<TFeatures, TData>(table): void;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:335](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L335)

Moves the table to the first page.

This is a convenience wrapper around `table_setPageIndex(table, 0)`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`void`

## Example

```ts
table_firstPage(table)
```

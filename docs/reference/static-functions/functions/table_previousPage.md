---
id: table_previousPage
title: table_previousPage
---

# Function: table\_previousPage()

```ts
function table_previousPage<TFeatures, TData>(table): void;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:298](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L298)

Moves the table to the previous page.

This delegates to `table_setPageIndex` so pagination state ownership and
updater semantics remain consistent.

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
table_previousPage(table)
```

---
id: table_getCanPreviousPage
title: table_getCanPreviousPage
---

# Function: table\_getCanPreviousPage()

```ts
function table_getCanPreviousPage<TFeatures, TData>(table): boolean;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:250](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L250)

Checks whether the current page index can move backward.

The first page is page index `0`, so only positive page indexes can navigate
to a previous page.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Example

```ts
const canGoBack = table_getCanPreviousPage(table)
```

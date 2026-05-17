---
id: table_getCanNextPage
title: table_getCanNextPage
---

# Function: table\_getCanNextPage()

```ts
function table_getCanNextPage<TFeatures, TData>(table): boolean;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:268](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L268)

Checks whether the current page index can move forward.

A `pageCount` of `-1` means the caller does not know the total page count, so
this returns `true`. A page count of `0` returns `false`.

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
const canGoForward = table_getCanNextPage(table)
```

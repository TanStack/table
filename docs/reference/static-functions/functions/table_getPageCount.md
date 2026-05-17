---
id: table_getPageCount
title: table_getPageCount
---

# Function: table\_getPageCount()

```ts
function table_getPageCount<TFeatures, TData>(table): number;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:370](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L370)

Resolves the number of pages for the current pagination state.

`options.pageCount` wins for manual pagination. Otherwise the value is
calculated from `table_getRowCount(table)` and the current `pageSize`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`number`

## Example

```ts
const pages = table_getPageCount(table)
```

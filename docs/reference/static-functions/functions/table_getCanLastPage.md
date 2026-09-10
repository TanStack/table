---
id: table_getCanLastPage
title: table_getCanLastPage
---

# Function: table\_getCanLastPage()

```ts
function table_getCanLastPage<TFeatures, TData>(table): boolean;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:299](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L299)

Checks whether a known, finite last page exists after the current page.

Unknown (`-1`), empty, and non-finite page counts do not have a navigable
last page.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Example

```ts
const canGoToLastPage = table_getCanLastPage(table)
```

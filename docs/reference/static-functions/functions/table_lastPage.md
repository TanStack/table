---
id: table_lastPage
title: table_lastPage
---

# Function: table\_lastPage()

```ts
function table_lastPage<TFeatures, TData>(table): void;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:377](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L377)

Moves the table to the last known page.

Unknown, empty, and non-finite page counts do not have a navigable last
page, so this does nothing for those states.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`void`

## Example

```ts
table_lastPage(table)
```

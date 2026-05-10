---
id: table_getCanPreviousPage
title: table_getCanPreviousPage
---

# Function: table\_getCanPreviousPage()

```ts
function table_getCanPreviousPage<TFeatures, TData>(table): boolean;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:237](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L237)

Returns can previous page for the table.

This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.

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
const value = table_getCanPreviousPage(table)
```

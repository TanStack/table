---
id: table_getCanNextPage
title: table_getCanNextPage
---

# Function: table\_getCanNextPage()

```ts
function table_getCanNextPage<TFeatures, TData>(table): boolean;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:254](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L254)

Returns can next page for the table.

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
const value = table_getCanNextPage(table)
```

---
id: table_getPageOptions
title: table_getPageOptions
---

# Function: table\_getPageOptions()

```ts
function table_getPageOptions<TFeatures, TData>(table): number[];
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:227](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L227)

Builds the zero-based page indexes available for the current page count.

Unknown or empty page counts return an empty array; otherwise the result is
`[0, 1, ...pageCount - 1]`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`number`[]

## Example

```ts
const pageIndexes = table_getPageOptions(table)
```

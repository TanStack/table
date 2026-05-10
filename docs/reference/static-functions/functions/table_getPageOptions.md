---
id: table_getPageOptions
title: table_getPageOptions
---

# Function: table\_getPageOptions()

```ts
function table_getPageOptions<TFeatures, TData>(table): number[];
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:215](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L215)

Returns page options for the table.

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

`number`[]

## Example

```ts
const value = table_getPageOptions(table)
```

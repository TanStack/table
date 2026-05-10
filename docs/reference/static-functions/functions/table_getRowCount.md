---
id: table_getRowCount
title: table_getRowCount
---

# Function: table\_getRowCount()

```ts
function table_getRowCount<TFeatures, TData>(table): number;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:378](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L378)

Returns row count for the table.

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

`number`

## Example

```ts
const value = table_getRowCount(table)
```

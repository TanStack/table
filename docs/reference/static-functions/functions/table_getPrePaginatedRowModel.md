---
id: table_getPrePaginatedRowModel
title: table_getPrePaginatedRowModel
---

# Function: table\_getPrePaginatedRowModel()

```ts
function table_getPrePaginatedRowModel<TFeatures, TData>(table): RowModel<TFeatures, TData>;
```

Defined in: [core/row-models/coreRowModelsFeature.utils.ts:221](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.utils.ts#L221)

Reads the row model immediately before pagination.

Pagination is the final built-in row-model stage, so this aliases
`table.getExpandedRowModel()`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`RowModel`](../../index/interfaces/RowModel.md)\<`TFeatures`, `TData`\>

## Example

```ts
const rowsBeforePagination = table_getPrePaginatedRowModel(table)
```

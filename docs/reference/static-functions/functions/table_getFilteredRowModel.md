---
id: table_getFilteredRowModel
title: table_getFilteredRowModel
---

# Function: table\_getFilteredRowModel()

```ts
function table_getFilteredRowModel<TFeatures, TData>(table): RowModel<TFeatures, TData>;
```

Defined in: [core/row-models/coreRowModelsFeature.utils.ts:61](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.utils.ts#L61)

Resolves the row model after column and global filtering.

When `manualFiltering` is enabled, or no filtered row-model factory was
registered, this returns the pre-filtered row model because filtering is
expected to happen outside the table.

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
const filteredRows = table_getFilteredRowModel(table)
```

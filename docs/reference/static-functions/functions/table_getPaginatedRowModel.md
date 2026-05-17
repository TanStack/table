---
id: table_getPaginatedRowModel
title: table_getPaginatedRowModel
---

# Function: table\_getPaginatedRowModel()

```ts
function table_getPaginatedRowModel<TFeatures, TData>(table): RowModel<TFeatures, TData>;
```

Defined in: [core/row-models/coreRowModelsFeature.utils.ts:240](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.utils.ts#L240)

Resolves the row model after pagination has sliced rows for the current page.

When `manualPagination` is enabled, or no paginated row-model factory was
registered, this returns the pre-paginated row model because pagination is
expected to happen before data reaches the table.

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
const pageRows = table_getPaginatedRowModel(table)
```

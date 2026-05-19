---
id: table_getSortedRowModel
title: table_getSortedRowModel
---

# Function: table\_getSortedRowModel()

```ts
function table_getSortedRowModel<TFeatures, TData>(table): RowModel<TFeatures, TData>;
```

Defined in: [core/row-models/coreRowModelsFeature.utils.ts:150](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.utils.ts#L150)

Resolves the row model after sorting has been applied.

When `manualSorting` is enabled, or no sorted row-model factory was
registered, this returns the pre-sorted row model because sorted data is
expected to be supplied by the caller.

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
const sortedRows = table_getSortedRowModel(table)
```

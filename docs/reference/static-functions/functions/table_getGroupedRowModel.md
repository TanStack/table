---
id: table_getGroupedRowModel
title: table_getGroupedRowModel
---

# Function: table\_getGroupedRowModel()

```ts
function table_getGroupedRowModel<TFeatures, TData>(table): RowModel<TFeatures, TData>;
```

Defined in: [core/row-models/coreRowModelsFeature.utils.ts:105](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.utils.ts#L105)

Resolves the row model after grouping has produced grouped and aggregated rows.

When `manualGrouping` is enabled, or no grouped row-model factory was
registered, this returns the pre-grouped row model unchanged.

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
const groupedRows = table_getGroupedRowModel(table)
```

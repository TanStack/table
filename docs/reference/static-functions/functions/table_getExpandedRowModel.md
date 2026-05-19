---
id: table_getExpandedRowModel
title: table_getExpandedRowModel
---

# Function: table\_getExpandedRowModel()

```ts
function table_getExpandedRowModel<TFeatures, TData>(table): RowModel<TFeatures, TData>;
```

Defined in: [core/row-models/coreRowModelsFeature.utils.ts:194](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.utils.ts#L194)

Resolves the row model after expanded rows have been flattened into view.

When `manualExpanding` is enabled, or no expanded row-model factory was
registered, this returns the pre-expanded row model unchanged.

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
const expandedRows = table_getExpandedRowModel(table)
```

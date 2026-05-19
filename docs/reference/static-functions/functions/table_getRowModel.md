---
id: table_getRowModel
title: table_getRowModel
---

# Function: table\_getRowModel()

```ts
function table_getRowModel<TFeatures, TData>(table): RowModel<TFeatures, TData>;
```

Defined in: [core/row-models/coreRowModelsFeature.utils.ts:267](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.utils.ts#L267)

Resolves the final row model consumed by renderers.

This is the end of the built-in row-model pipeline: core -> filtering ->
grouping -> sorting -> expanding -> pagination.

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
const visibleRows = table_getRowModel(table)
```

---
id: table_getPreFilteredRowModel
title: table_getPreFilteredRowModel
---

# Function: table\_getPreFilteredRowModel()

```ts
function table_getPreFilteredRowModel<TFeatures, TData>(table): RowModel<TFeatures, TData>;
```

Defined in: [core/row-models/coreRowModelsFeature.utils.ts:42](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.utils.ts#L42)

Reads the row model immediately before column/global filtering.

Filtering is the first derived row-model stage, so this currently aliases
`table.getCoreRowModel()`.

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
const rowsBeforeFiltering = table_getPreFilteredRowModel(table)
```

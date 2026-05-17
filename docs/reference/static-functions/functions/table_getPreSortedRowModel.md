---
id: table_getPreSortedRowModel
title: table_getPreSortedRowModel
---

# Function: table\_getPreSortedRowModel()

```ts
function table_getPreSortedRowModel<TFeatures, TData>(table): RowModel<TFeatures, TData>;
```

Defined in: [core/row-models/coreRowModelsFeature.utils.ts:131](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.utils.ts#L131)

Reads the row model immediately before sorting.

Sorting runs after grouping, so this aliases `table.getGroupedRowModel()`.

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
const rowsBeforeSorting = table_getPreSortedRowModel(table)
```

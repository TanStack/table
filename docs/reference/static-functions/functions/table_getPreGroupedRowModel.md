---
id: table_getPreGroupedRowModel
title: table_getPreGroupedRowModel
---

# Function: table\_getPreGroupedRowModel()

```ts
function table_getPreGroupedRowModel<TFeatures, TData>(table): RowModel<TFeatures, TData>;
```

Defined in: [core/row-models/coreRowModelsFeature.utils.ts:87](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.utils.ts#L87)

Reads the row model immediately before grouping.

Grouping runs after filtering, so this aliases `table.getFilteredRowModel()`.

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
const rowsBeforeGrouping = table_getPreGroupedRowModel(table)
```

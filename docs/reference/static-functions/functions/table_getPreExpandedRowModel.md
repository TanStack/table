---
id: table_getPreExpandedRowModel
title: table_getPreExpandedRowModel
---

# Function: table\_getPreExpandedRowModel()

```ts
function table_getPreExpandedRowModel<TFeatures, TData>(table): RowModel<TFeatures, TData>;
```

Defined in: [core/row-models/coreRowModelsFeature.utils.ts:176](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.utils.ts#L176)

Reads the row model immediately before row expansion.

Expansion runs after sorting, so this aliases `table.getSortedRowModel()`.

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
const rowsBeforeExpansion = table_getPreExpandedRowModel(table)
```

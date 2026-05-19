---
id: table_getFilteredSelectedRowModel
title: table_getFilteredSelectedRowModel
---

# Function: table\_getFilteredSelectedRowModel()

```ts
function table_getFilteredSelectedRowModel<TFeatures, TData>(table): RowModel<TFeatures, TData>;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:201](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L201)

Builds a row model containing selected rows from the filtered row model.

If no row ids are selected, an empty row model is returned without walking
the rows.

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
const selectedRows = table_getFilteredSelectedRowModel(table)
```

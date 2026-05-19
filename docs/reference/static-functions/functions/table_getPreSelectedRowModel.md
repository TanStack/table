---
id: table_getPreSelectedRowModel
title: table_getPreSelectedRowModel
---

# Function: table\_getPreSelectedRowModel()

```ts
function table_getPreSelectedRowModel<TFeatures, TData>(table): RowModel<TFeatures, TData>;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:155](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L155)

Reads the row model before row selection is projected into selected rows.

Selection does not alter the base row pipeline, so this returns the core row
model.

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
const rowsBeforeSelection = table_getPreSelectedRowModel(table)
```

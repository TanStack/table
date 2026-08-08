---
id: table_getFilteredSelectedRowModel
title: table_getFilteredSelectedRowModel
---

# Function: table\_getFilteredSelectedRowModel()

```ts
function table_getFilteredSelectedRowModel<TFeatures, TData>(table):
  | RowModel<TFeatures, TData>
  | {
  flatRows: never[];
  rows: never[];
  rowsById: Record<string, unknown>;
};
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:270](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L270)

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

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

  \| [`RowModel`](../../index/interfaces/RowModel.md)\<`TFeatures`, `TData`\>
  \| \{
  `flatRows`: `never`[];
  `rows`: `never`[];
  `rowsById`: `Record`\<`string`, `unknown`\>;
\}

## Example

```ts
const selectedRows = table_getFilteredSelectedRowModel(table)
```

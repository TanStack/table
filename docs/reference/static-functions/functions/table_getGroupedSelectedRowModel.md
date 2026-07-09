---
id: table_getGroupedSelectedRowModel
title: table_getGroupedSelectedRowModel
---

# Function: table\_getGroupedSelectedRowModel()

```ts
function table_getGroupedSelectedRowModel<TFeatures, TData>(table): 
  | RowModel<TFeatures, TData>
  | {
  flatRows: never[];
  rows: never[];
  rowsById: Record<string, unknown>;
};
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:281](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L281)

Builds a row model containing selected rows from the grouped row model.

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
const selectedRows = table_getGroupedSelectedRowModel(table)
```

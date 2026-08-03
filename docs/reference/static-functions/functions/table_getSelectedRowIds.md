---
id: table_getSelectedRowIds
title: table_getSelectedRowIds
---

# Function: table\_getSelectedRowIds()

```ts
function table_getSelectedRowIds<TFeatures, TData>(table): string[];
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:336](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L336)

Returns the ids of all selected rows.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`string`[]

## Example

```ts
const selectedRowIds = table_getSelectedRowIds(table)
```

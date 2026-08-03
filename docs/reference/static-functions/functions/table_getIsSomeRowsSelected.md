---
id: table_getIsSomeRowsSelected
title: table_getIsSomeRowsSelected
---

# Function: table\_getIsSomeRowsSelected()

```ts
function table_getIsSomeRowsSelected<TFeatures, TData>(table): boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:406](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L406)

Checks whether at least one row id is selected.

The result stays true when every row is selected.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Example

```ts
const someRowsSelected = table_getIsSomeRowsSelected(table)
```

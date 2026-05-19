---
id: table_getIsAllPageRowsSelected
title: table_getIsAllPageRowsSelected
---

# Function: table\_getIsAllPageRowsSelected()

```ts
function table_getIsAllPageRowsSelected<TFeatures, TData>(table): boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:291](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L291)

Checks whether every selectable row on the current page is selected.

Non-selectable rows are ignored for this calculation.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Example

```ts
const allPageRowsSelected = table_getIsAllPageRowsSelected(table)
```

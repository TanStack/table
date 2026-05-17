---
id: table_getIsSomePageRowsSelected
title: table_getIsSomePageRowsSelected
---

# Function: table\_getIsSomePageRowsSelected()

```ts
function table_getIsSomePageRowsSelected<TFeatures, TData>(table): boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:347](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L347)

Checks whether the current page has a partial selection.

This is false when all selectable page rows are selected. Otherwise it is true
if any selectable page row or descendant is selected.

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
const somePageRowsSelected = table_getIsSomePageRowsSelected(table)
```

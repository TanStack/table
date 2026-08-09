---
id: table_getIsSomePageRowsSelected
title: table_getIsSomePageRowsSelected
---

# Function: table\_getIsSomePageRowsSelected()

```ts
function table_getIsSomePageRowsSelected<TFeatures, TData>(table): boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:456](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L456)

Checks whether at least one selectable row on the current page is selected.

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
const somePageRowsSelected = table_getIsSomePageRowsSelected(table)
```

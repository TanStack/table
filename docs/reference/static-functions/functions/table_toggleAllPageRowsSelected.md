---
id: table_toggleAllPageRowsSelected
title: table_toggleAllPageRowsSelected
---

# Function: table\_toggleAllPageRowsSelected()

```ts
function table_toggleAllPageRowsSelected<TFeatures, TData>(table, value?): void;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:124](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L124)

Selects or deselects every selectable row on the current page.

Omitting `value` toggles based on `table_getIsAllPageRowsSelected(table)`.
Child rows are included when sub-row selection allows it.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### value?

`boolean`

## Returns

`void`

## Example

```ts
table_toggleAllPageRowsSelected(table)
```

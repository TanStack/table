---
id: table_toggleAllPageRowsSelected
title: table_toggleAllPageRowsSelected
---

# Function: table\_toggleAllPageRowsSelected()

```ts
function table_toggleAllPageRowsSelected<TFeatures, TData>(table, value?): void;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:119](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L119)

Toggles all page rows selected for the table.

This is the table-level convenience API used by UI controls that affect many columns or rows at once.

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

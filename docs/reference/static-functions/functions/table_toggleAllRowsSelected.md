---
id: table_toggleAllRowsSelected
title: table_toggleAllRowsSelected
---

# Function: table\_toggleAllRowsSelected()

```ts
function table_toggleAllRowsSelected<TFeatures, TData>(table, value?): void;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:82](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L82)

Selects or deselects every selectable row before grouping.

Omitting `value` toggles based on `table_getIsAllRowsSelected(table)`.
Deselecting removes matching ids from the existing selection map.

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
table_toggleAllRowsSelected(table)
```

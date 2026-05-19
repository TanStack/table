---
id: row_getIsAllSubRowsSelected
title: row_getIsAllSubRowsSelected
---

# Function: row\_getIsAllSubRowsSelected()

```ts
function row_getIsAllSubRowsSelected<TFeatures, TData>(row): boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:495](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L495)

Checks whether all selectable descendants are selected.

Rows without selectable descendants return false.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Example

```ts
const allChildrenSelected = row_getIsAllSubRowsSelected(row)
```

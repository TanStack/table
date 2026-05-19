---
id: row_getIsSelected
title: row_getIsSelected
---

# Function: row\_getIsSelected()

```ts
function row_getIsSelected<TFeatures, TData>(row): boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:461](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L461)

Checks whether this row id is selected in `state.rowSelection`.

Missing row ids are treated as not selected.

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
const selected = row_getIsSelected(row)
```

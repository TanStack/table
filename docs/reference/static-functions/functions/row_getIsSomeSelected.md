---
id: row_getIsSomeSelected
title: row_getIsSomeSelected
---

# Function: row\_getIsSomeSelected()

```ts
function row_getIsSomeSelected<TFeatures, TData>(row): boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:478](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L478)

Checks whether some, but not all, selectable descendants are selected.

This supports indeterminate selection UI for parent rows.

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
const partial = row_getIsSomeSelected(row)
```

---
id: row_getCanMultiSelect
title: row_getCanMultiSelect
---

# Function: row\_getCanMultiSelect()

```ts
function row_getCanMultiSelect<TFeatures, TData>(row): boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:541](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L541)

Returns whether a row can use multi select.

This evaluates row data, table options, and feature-specific enablement rules.

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
const value = row_getCanMultiSelect(row)
```

---
id: row_getCanSelectSubRows
title: row_getCanSelectSubRows
---

# Function: row\_getCanSelectSubRows()

```ts
function row_getCanSelectSubRows<TFeatures, TData>(row): boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:519](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L519)

Returns whether a row can use select sub rows.

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
const value = row_getCanSelectSubRows(row)
```

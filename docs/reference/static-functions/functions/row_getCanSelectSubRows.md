---
id: row_getCanSelectSubRows
title: row_getCanSelectSubRows
---

# Function: row\_getCanSelectSubRows()

```ts
function row_getCanSelectSubRows<TFeatures, TData>(row): boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:536](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L536)

Checks whether selecting this row should also select its subRows.

`options.enableSubRowSelection` may be a boolean or a row predicate; it
defaults to `true`.

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
const canSelectChildren = row_getCanSelectSubRows(row)
```

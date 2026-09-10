---
id: table_selectCellRange
title: table_selectCellRange
---

# Function: table\_selectCellRange()

```ts
function table_selectCellRange<TFeatures, TData>(
   table,
   range,
   opts?): void;
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:808](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L808)

Selects a rectangle using replace, include, or exclude semantics.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

### range

[`CellSelectionRange`](../../index/interfaces/CellSelectionRange.md)

### opts?

[`SelectCellRangeOptions`](../../index/interfaces/SelectCellRangeOptions.md)

## Returns

`void`

## Example

```ts
table_selectCellRange(table, range, { mode: 'exclude' })
```

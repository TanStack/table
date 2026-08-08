---
id: table_autoResetCellSelection
title: table_autoResetCellSelection
---

# Function: table\_autoResetCellSelection()

```ts
function table_autoResetCellSelection<TFeatures, TData>(table): void;
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:104](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L104)

Schedules a cell selection reset after `data` changes.

Ranges are stored as row and column ids, so without this a data swap would
leave a selection pointing at rows that no longer exist, or silently
re-select cells whenever new data reuses ids. The reset runs when
`autoResetAll` or `autoResetCellSelection` allows it, defaulting to on.

Resetting to `initialState.cellSelection` rather than to empty means the
first row-model computation is a no-op, matching `table_autoResetExpanded`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`void`

## Example

```ts
table_autoResetCellSelection(table)
```

---
id: table_getVisibleLeafColumns
title: table_getVisibleLeafColumns
---

# Function: table\_getVisibleLeafColumns()

```ts
function table_getVisibleLeafColumns<TFeatures, TData>(table): Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:239](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L239)

Filters leaf columns down to those currently visible.

This is the column list most row rendering code uses before pinning-specific
partitioning.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`Column`](../../index/type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Example

```ts
const columns = table_getVisibleLeafColumns(table)
```

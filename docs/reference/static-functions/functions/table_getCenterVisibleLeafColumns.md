---
id: table_getCenterVisibleLeafColumns
title: table_getCenterVisibleLeafColumns
---

# Function: table\_getCenterVisibleLeafColumns()

```ts
function table_getCenterVisibleLeafColumns<TFeatures, TData>(table): Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:868](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L868)

Resolves visible leaf columns that are not pinned.

This is the center partition used by layouts that render pinned columns
separately from the scrollable middle region.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`Column`](../../index/type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Example

```ts
const columns = table_getCenterVisibleLeafColumns(table)
```

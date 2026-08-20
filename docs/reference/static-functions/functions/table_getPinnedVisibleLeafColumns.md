---
id: table_getPinnedVisibleLeafColumns
title: table_getPinnedVisibleLeafColumns
---

# Function: table\_getPinnedVisibleLeafColumns()

```ts
function table_getPinnedVisibleLeafColumns<TFeatures, TData>(table, position?):
  | Column<TFeatures, TData, unknown>[]
  | Column_Internal<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:892](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L892)

Resolves visible leaf columns for a requested pinning region.

Omit `position` to get all visible leaf columns, or pass `'start'`, `'center'`,
or `'end'` to get one partition.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

### position?

[`ColumnPinningPosition`](../../index/type-aliases/ColumnPinningPosition.md) | `"center"`

## Returns

  \| [`Column`](../../index/type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]
  \| [`Column_Internal`](../../index/interfaces/Column_Internal.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Example

```ts
const columns = table_getPinnedVisibleLeafColumns(table, 'start')
```

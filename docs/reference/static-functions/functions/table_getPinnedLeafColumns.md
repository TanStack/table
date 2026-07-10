---
id: table_getPinnedLeafColumns
title: table_getPinnedLeafColumns
---

# Function: table\_getPinnedLeafColumns()

```ts
function table_getPinnedLeafColumns<TFeatures, TData>(table, position): 
  | Column<TFeatures, TData, unknown>[]
  | Column_Internal<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:781](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L781)

Resolves leaf columns for a requested pinning region.

Pass `'start'`, `'center'`, or `'end'` for a partition, or pass `false` to
read all leaf columns without partitioning.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

### position

[`ColumnPinningPosition`](../../index/type-aliases/ColumnPinningPosition.md) | `"center"`

## Returns

  \| [`Column`](../../index/type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]
  \| [`Column_Internal`](../../index/interfaces/Column_Internal.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Example

```ts
const columns = table_getPinnedLeafColumns(table, 'center')
```

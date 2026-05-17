---
id: table_getPinnedLeafColumns
title: table_getPinnedLeafColumns
---

# Function: table\_getPinnedLeafColumns()

```ts
function table_getPinnedLeafColumns<TFeatures, TData>(table, position): any[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:767](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L767)

Resolves leaf columns for a requested pinning region.

Pass `'left'`, `'center'`, or `'right'` for a partition, or pass `false` to
read all leaf columns without partitioning.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### position

[`ColumnPinningPosition`](../../index/type-aliases/ColumnPinningPosition.md) | `"center"`

## Returns

`any`[]

## Example

```ts
const columns = table_getPinnedLeafColumns(table, 'center')
```

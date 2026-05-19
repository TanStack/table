---
id: table_getPinnedVisibleLeafColumns
title: table_getPinnedVisibleLeafColumns
---

# Function: table\_getPinnedVisibleLeafColumns()

```ts
function table_getPinnedVisibleLeafColumns<TFeatures, TData>(table, position?): any[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:878](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L878)

Resolves visible leaf columns for a requested pinning region.

Omit `position` to get all visible leaf columns, or pass `'left'`, `'center'`,
or `'right'` to get one partition.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### position?

[`ColumnPinningPosition`](../../index/type-aliases/ColumnPinningPosition.md) | `"center"`

## Returns

`any`[]

## Example

```ts
const columns = table_getPinnedVisibleLeafColumns(table, 'left')
```

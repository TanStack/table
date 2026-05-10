---
id: table_getPinnedVisibleLeafColumns
title: table_getPinnedVisibleLeafColumns
---

# Function: table\_getPinnedVisibleLeafColumns()

```ts
function table_getPinnedVisibleLeafColumns<TFeatures, TData>(table, position?): any[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:820](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L820)

Returns pinned visible leaf columns for the table.

This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.

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
const value = table_getPinnedVisibleLeafColumns(table)
```

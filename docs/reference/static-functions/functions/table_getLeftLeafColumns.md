---
id: table_getLeftLeafColumns
title: table_getLeftLeafColumns
---

# Function: table\_getLeftLeafColumns()

```ts
function table_getLeftLeafColumns<TFeatures, TData>(table): Column_Internal<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:695](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L695)

Resolves leaf columns pinned to the left region.

The result follows `state.columnPinning.left` order and skips stale ids that
no longer correspond to a leaf column.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`Column_Internal`](../../index/type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Example

```ts
const columns = table_getLeftLeafColumns(table)
```

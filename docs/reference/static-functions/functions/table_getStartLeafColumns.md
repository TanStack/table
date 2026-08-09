---
id: table_getStartLeafColumns
title: table_getStartLeafColumns
---

# Function: table\_getStartLeafColumns()

```ts
function table_getStartLeafColumns<TFeatures, TData>(table): Column_Internal<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:711](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L711)

Resolves leaf columns pinned to the start region.

The result follows `state.columnPinning.start` order and skips stale ids that
no longer correspond to a leaf column.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`Column_Internal`](../../index/interfaces/Column_Internal.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Example

```ts
const columns = table_getStartLeafColumns(table)
```

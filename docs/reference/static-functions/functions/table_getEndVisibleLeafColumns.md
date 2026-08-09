---
id: table_getEndVisibleLeafColumns
title: table_getEndVisibleLeafColumns
---

# Function: table\_getEndVisibleLeafColumns()

```ts
function table_getEndVisibleLeafColumns<TFeatures, TData>(table): Column_Internal<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:849](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L849)

Resolves visible leaf columns pinned to the end region.

Hidden pinned columns are filtered out after the end pin order is applied.

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
const columns = table_getEndVisibleLeafColumns(table)
```

---
id: table_getCellSelectionRowIds
title: table_getCellSelectionRowIds
---

# Function: table\_getCellSelectionRowIds()

```ts
function table_getCellSelectionRowIds<TFeatures, TData>(table): string[];
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:1301](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L1301)

Returns the ids of all rows intersected by the selection.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`string`[]

## Example

```ts
const rowIds = table_getCellSelectionRowIds(table)
```

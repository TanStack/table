---
id: table_getCellSelectionColumnIds
title: table_getCellSelectionColumnIds
---

# Function: table\_getCellSelectionColumnIds()

```ts
function table_getCellSelectionColumnIds<TFeatures, TData>(table): string[];
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:1358](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L1358)

Returns the ids of all columns intersected by the selection.

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
const columnIds = table_getCellSelectionColumnIds(table)
```

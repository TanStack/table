---
id: cell_getTabIndex
title: cell_getTabIndex
---

# Function: cell\_getTabIndex()

```ts
function cell_getTabIndex<TFeatures, TData, TValue>(cell): number;
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:444](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L444)

Returns `0` for the focused cell and `-1` otherwise, for roving tabindex.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### cell

[`Cell`](../../index/type-aliases/Cell.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`number`

## Example

```ts
const tabIndex = cell_getTabIndex(cell)
```

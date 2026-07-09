---
id: row_getEndVisibleCells
title: row_getEndVisibleCells
---

# Function: row\_getEndVisibleCells()

```ts
function row_getEndVisibleCells<TFeatures, TData>(row): Cell<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:261](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L261)

Collects visible cells for columns pinned to the end region.

Cells are returned in `state.columnPinning.end` order and are marked with
`cell.position = 'end'`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

## Returns

[`Cell`](../../index/type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Example

```ts
const rightCells = row_getEndVisibleCells(row)
```

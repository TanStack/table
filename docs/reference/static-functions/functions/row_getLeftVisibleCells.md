---
id: row_getLeftVisibleCells
title: row_getLeftVisibleCells
---

# Function: row\_getLeftVisibleCells()

```ts
function row_getLeftVisibleCells<TFeatures, TData>(row): Cell<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:215](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L215)

Collects visible cells for columns pinned to the left region.

Cells are returned in `state.columnPinning.left` order and are marked with
`cell.position = 'left'`.

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
const leftCells = row_getLeftVisibleCells(row)
```

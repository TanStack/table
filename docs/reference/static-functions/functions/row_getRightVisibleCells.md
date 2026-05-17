---
id: row_getRightVisibleCells
title: row_getRightVisibleCells
---

# Function: row\_getRightVisibleCells()

```ts
function row_getRightVisibleCells<TFeatures, TData>(row): Cell<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:251](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L251)

Collects visible cells for columns pinned to the right region.

Cells are returned in `state.columnPinning.right` order and are marked with
`cell.position = 'right'`.

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
const rightCells = row_getRightVisibleCells(row)
```

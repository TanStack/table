---
id: row_getStartVisibleCells
title: row_getStartVisibleCells
---

# Function: row\_getStartVisibleCells()

```ts
function row_getStartVisibleCells<TFeatures, TData>(row): Cell<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:233](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L233)

Collects visible cells for columns pinned to the start region.

Cells are returned in `state.columnPinning.start` order and are marked with
`cell.position = 'start'`.

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
const startCells = row_getStartVisibleCells(row)
```

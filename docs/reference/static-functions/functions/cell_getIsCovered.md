---
id: cell_getIsCovered
title: cell_getIsCovered
---

# Function: cell\_getIsCovered()

```ts
function cell_getIsCovered<TFeatures, TData, TValue>(cell): boolean;
```

Defined in: [features/cell-spanning/cellSpanningFeature.utils.ts:423](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.utils.ts#L423)

Checks whether another cell's span covers this cell.

Covered cells must not be rendered; the cell that covers them carries the
content and the span attributes.

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

`boolean`

## Example

```ts
const isCovered = cell_getIsCovered(cell)
```

---
id: cell_getColSpan
title: cell_getColSpan
---

# Function: cell\_getColSpan()

```ts
function cell_getColSpan<TFeatures, TData, TValue>(cell): number;
```

Defined in: [features/cell-spanning/cellSpanningFeature.utils.ts:393](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.utils.ts#L393)

Returns how many columns this cell spans.

`1` when it does not span, and `0` when another cell's column span covers
it.

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
const colSpan = cell_getColSpan(cell)
```

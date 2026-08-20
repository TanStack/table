---
id: cell_getRowSpan
title: cell_getRowSpan
---

# Function: cell\_getRowSpan()

```ts
function cell_getRowSpan<TFeatures, TData, TValue>(cell): number;
```

Defined in: [features/cell-spanning/cellSpanningFeature.utils.ts:364](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.utils.ts#L364)

Returns how many rows this cell spans.

`1` when it does not span, and `0` when a spanning cell above it covers it,
matching the `header.rowSpan` convention where `0` means "skip this cell".

Deliberately not memoized: a per-cell memo would allocate a closure and a
dependency array for every cell, costing more than the two lookups this
performs against the table-level span index.

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
const rowSpan = cell_getRowSpan(cell)
```

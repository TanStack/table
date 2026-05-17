---
id: row_getAllCells
title: row_getAllCells
---

# Function: row\_getAllCells()

```ts
function row_getAllCells<TFeatures, TData>(row): Cell<TFeatures, TData, unknown>[];
```

Defined in: [core/rows/coreRowsFeature.utils.ts:167](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.utils.ts#L167)

Constructs one cell for each leaf column in this row.

The result follows `table.getAllLeafColumns()` order and includes hidden
columns; visibility-specific APIs filter this list later.

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
const cells = row_getAllCells(row)
```

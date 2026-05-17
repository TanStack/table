---
id: cell_getValue
title: cell_getValue
---

# Function: cell\_getValue()

```ts
function cell_getValue<TFeatures, TData, TValue>(cell): TValue;
```

Defined in: [core/cells/coreCellsFeature.utils.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.utils.ts#L16)

Reads this cell's accessor value from its owning row and column.

This is the standalone implementation behind `cell.getValue()`, useful when
importing static APIs instead of calling methods from the cell prototype.

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

`TValue`

## Example

```ts
const value = cell_getValue(cell)
```

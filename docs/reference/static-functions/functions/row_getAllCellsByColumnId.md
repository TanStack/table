---
id: row_getAllCellsByColumnId
title: row_getAllCellsByColumnId
---

# Function: row\_getAllCellsByColumnId()

```ts
function row_getAllCellsByColumnId<TFeatures, TData>(row): Record<string, Cell<TFeatures, TData, unknown>>;
```

Defined in: [core/rows/coreRowsFeature.utils.ts:191](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.utils.ts#L191)

Builds a lookup map of this row's cells keyed by column id.

This is the static implementation behind `row.getAllCellsByColumnId()`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

## Returns

`Record`\<`string`, [`Cell`](../../index/type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>\>

## Example

```ts
const cellsById = row_getAllCellsByColumnId(row)
```

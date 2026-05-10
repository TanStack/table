---
id: row_getAllCellsByColumnId
title: row_getAllCellsByColumnId
---

# Function: row\_getAllCellsByColumnId()

```ts
function row_getAllCellsByColumnId<TFeatures, TData>(row): Record<string, Cell<TFeatures, TData, unknown>>;
```

Defined in: [core/rows/coreRowsFeature.utils.ts:182](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.utils.ts#L182)

Returns all cells by column id for a row.

This is the static implementation behind the matching row instance API and may read row caches or table state atoms.

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
const value = row_getAllCellsByColumnId(row)
```

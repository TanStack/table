---
id: row_getLeafRows
title: row_getLeafRows
---

# Function: row\_getLeafRows()

```ts
function row_getLeafRows<TFeatures, TData>(row): Row<TFeatures, TData>[];
```

Defined in: [core/rows/coreRowsFeature.utils.ts:103](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.utils.ts#L103)

Returns leaf rows for a row.

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

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

## Example

```ts
const value = row_getLeafRows(row)
```

---
id: row_getParentRows
title: row_getParentRows
---

# Function: row\_getParentRows()

```ts
function row_getParentRows<TFeatures, TData>(row): Row<TFeatures, TData>[];
```

Defined in: [core/rows/coreRowsFeature.utils.ts:140](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.utils.ts#L140)

Collects this row's ancestor chain from root to direct parent.

The current row is not included. Rows without a parent return an empty array.

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
const ancestors = row_getParentRows(row)
```

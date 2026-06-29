---
id: row_getLeafRows
title: row_getLeafRows
---

# Function: row\_getLeafRows()

```ts
function row_getLeafRows<TFeatures, TData>(row): Row<TFeatures, TData>[];
```

Defined in: [core/rows/coreRowsFeature.utils.ts:105](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.utils.ts#L105)

Flattens this row's descendant tree into leaf rows.

The row itself is not included; only nested `subRows` are walked.

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
const descendants = row_getLeafRows(row)
```

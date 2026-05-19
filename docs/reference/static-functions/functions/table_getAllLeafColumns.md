---
id: table_getAllLeafColumns
title: table_getAllLeafColumns
---

# Function: table\_getAllLeafColumns()

```ts
function table_getAllLeafColumns<TFeatures, TData>(table): Column<TFeatures, TData, unknown>[];
```

Defined in: [core/columns/coreColumnsFeature.utils.ts:208](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.utils.ts#L208)

Collects all terminal leaf columns in their current table order.

Column ordering features can reorder the collected leaves before the result
is returned.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`Column`](../../index/type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Example

```ts
const leafColumns = table_getAllLeafColumns(table)
```

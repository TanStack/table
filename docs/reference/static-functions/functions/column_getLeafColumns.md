---
id: column_getLeafColumns
title: column_getLeafColumns
---

# Function: column\_getLeafColumns()

```ts
function column_getLeafColumns<TFeatures, TData, TValue>(column): Column<TFeatures, TData, TValue>[];
```

Defined in: [core/columns/coreColumnsFeature.utils.ts:44](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.utils.ts#L44)

Returns leaf columns for a column.

This derives the value from the column definition, table options, and the feature state atoms registered on the table.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column`](../../index/type-aliases/Column.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

[`Column`](../../index/type-aliases/Column.md)\<`TFeatures`, `TData`, `TValue`\>[]

## Example

```ts
const value = column_getLeafColumns(column)
```

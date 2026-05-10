---
id: table_getAllColumns
title: table_getAllColumns
---

# Function: table\_getAllColumns()

```ts
function table_getAllColumns<TFeatures, TData>(table): Column<TFeatures, TData, unknown>[];
```

Defined in: [core/columns/coreColumnsFeature.utils.ts:115](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.utils.ts#L115)

Returns all columns for the table.

This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.

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
const value = table_getAllColumns(table)
```

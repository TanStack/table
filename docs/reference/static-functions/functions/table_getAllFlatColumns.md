---
id: table_getAllFlatColumns
title: table_getAllFlatColumns
---

# Function: table\_getAllFlatColumns()

```ts
function table_getAllFlatColumns<TFeatures, TData>(table): Column<TFeatures, TData, unknown>[];
```

Defined in: [core/columns/coreColumnsFeature.utils.ts:156](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.utils.ts#L156)

Returns all flat columns for the table.

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
const value = table_getAllFlatColumns(table)
```

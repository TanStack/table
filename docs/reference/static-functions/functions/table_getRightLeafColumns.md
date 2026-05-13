---
id: table_getRightLeafColumns
title: table_getRightLeafColumns
---

# Function: table\_getRightLeafColumns()

```ts
function table_getRightLeafColumns<TFeatures, TData>(table): Column_Internal<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:688](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L688)

Returns right leaf columns for the table.

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

[`Column_Internal`](../../index/type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Example

```ts
const value = table_getRightLeafColumns(table)
```

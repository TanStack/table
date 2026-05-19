---
id: table_getCenterLeafColumns
title: table_getCenterLeafColumns
---

# Function: table\_getCenterLeafColumns()

```ts
function table_getCenterLeafColumns<TFeatures, TData>(table): Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:746](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L746)

Resolves leaf columns that are not pinned to either side.

Left- and right-pinned ids are removed from `table.getAllLeafColumns()`.

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
const columns = table_getCenterLeafColumns(table)
```

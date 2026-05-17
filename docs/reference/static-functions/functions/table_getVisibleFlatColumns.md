---
id: table_getVisibleFlatColumns
title: table_getVisibleFlatColumns
---

# Function: table\_getVisibleFlatColumns()

```ts
function table_getVisibleFlatColumns<TFeatures, TData>(table): Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:217](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L217)

Filters the flat column list down to visible columns.

Parent/group columns are included when `column_getIsVisible` considers them
visible.

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
const columns = table_getVisibleFlatColumns(table)
```

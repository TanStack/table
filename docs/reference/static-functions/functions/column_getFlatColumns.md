---
id: column_getFlatColumns
title: column_getFlatColumns
---

# Function: column\_getFlatColumns()

```ts
function column_getFlatColumns<TFeatures, TData, TValue>(column): Column<TFeatures, TData, TValue>[];
```

Defined in: [core/columns/coreColumnsFeature.utils.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.utils.ts#L25)

Flattens this column and every descendant column into a single array.

Group columns appear before their child columns, which matches the normalized
column hierarchy produced during table construction.

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
const flatColumns = column_getFlatColumns(column)
```

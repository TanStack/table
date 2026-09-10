---
id: column_getLeafColumns
title: column_getLeafColumns
---

# Function: column\_getLeafColumns()

```ts
function column_getLeafColumns<TFeatures, TData, TValue>(column): Column<TFeatures, TData, TValue>[];
```

Defined in: [core/columns/coreColumnsFeature.utils.ts:46](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.utils.ts#L46)

Collects the terminal leaf columns below this column.

Group columns return their ordered descendants. Non-group columns return an
array containing only the column itself.

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
const leafColumns = column_getLeafColumns(column)
```

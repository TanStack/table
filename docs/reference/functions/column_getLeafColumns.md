---
id: column_getLeafColumns
title: column_getLeafColumns
---

# Function: column\_getLeafColumns()

```ts
function column_getLeafColumns<TFeatures, TData, TValue>(column): Column<TFeatures, TData, TValue>[];
```

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.utils.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.utils.ts#L24)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `TValue`\>[]

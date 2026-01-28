---
id: table_getAllLeafColumns
title: table_getAllLeafColumns
---

# Function: table\_getAllLeafColumns()

```ts
function table_getAllLeafColumns<TFeatures, TData>(table): Column<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.utils.ts:130](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.utils.ts#L130)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

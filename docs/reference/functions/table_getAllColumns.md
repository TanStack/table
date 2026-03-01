---
id: table_getAllColumns
title: table_getAllColumns
---

# Function: table\_getAllColumns()

```ts
function table_getAllColumns<TFeatures, TData>(table): Column<TFeatures, TData, unknown>[];
```

Defined in: [core/columns/coreColumnsFeature.utils.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.utils.ts#L75)

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

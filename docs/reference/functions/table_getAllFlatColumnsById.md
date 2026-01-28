---
id: table_getAllFlatColumnsById
title: table_getAllFlatColumnsById
---

# Function: table\_getAllFlatColumnsById()

```ts
function table_getAllFlatColumnsById<TFeatures, TData>(table): Record<string, Column<TFeatures, TData, unknown>>;
```

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.utils.ts:115](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.utils.ts#L115)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`Record`\<`string`, [`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>\>

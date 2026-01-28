---
id: orderColumns
title: orderColumns
---

# Function: orderColumns()

```ts
function orderColumns<TFeatures, TData>(table, leafColumns): Column_Internal<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/features/column-ordering/columnOrderingFeature.utils.ts:106](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.utils.ts#L106)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### leafColumns

[`Column_Internal`](../type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Returns

[`Column_Internal`](../type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `unknown`\>[]

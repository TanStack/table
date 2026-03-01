---
id: table_getCenterLeafColumns
title: table_getCenterLeafColumns
---

# Function: table\_getCenterLeafColumns()

```ts
function table_getCenterLeafColumns<TFeatures, TData>(table): Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:428](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L428)

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

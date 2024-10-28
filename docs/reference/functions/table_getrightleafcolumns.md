---
id: table_getRightLeafColumns
title: table_getRightLeafColumns
---

# Function: table\_getRightLeafColumns()

```ts
function table_getRightLeafColumns<TFeatures, TData>(table): Column<TFeatures, TData, unknown>[]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Defined in

[features/column-pinning/ColumnPinning.utils.ts:355](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.utils.ts#L355)

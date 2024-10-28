---
id: table_getAllFlatColumns
title: table_getAllFlatColumns
---

# Function: table\_getAllFlatColumns()

```ts
function table_getAllFlatColumns<TFeatures, TData>(table): Column<TFeatures, TData, unknown>[]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Defined in

[core/columns/Columns.utils.ts:99](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/Columns.utils.ts#L99)

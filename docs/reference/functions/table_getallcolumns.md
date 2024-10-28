---
id: table_getAllColumns
title: table_getAllColumns
---

# Function: table\_getAllColumns()

```ts
function table_getAllColumns<TFeatures, TData>(table): Column<TFeatures, TData, unknown>[]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Defined in

[core/columns/Columns.utils.ts:70](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/Columns.utils.ts#L70)

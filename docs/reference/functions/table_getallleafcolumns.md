---
id: table_getAllLeafColumns
title: table_getAllLeafColumns
---

# Function: table\_getAllLeafColumns()

```ts
function table_getAllLeafColumns<TFeatures, TData>(table): Column<TFeatures, TData, unknown>[]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Defined in

[core/columns/Columns.utils.ts:121](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/Columns.utils.ts#L121)

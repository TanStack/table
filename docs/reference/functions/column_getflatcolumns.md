---
id: column_getFlatColumns
title: column_getFlatColumns
---

# Function: column\_getFlatColumns()

```ts
function column_getFlatColumns<TFeatures, TData, TValue>(column): Column<TFeatures, TData, TValue>[]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>[]

## Defined in

[core/columns/Columns.utils.ts:13](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/Columns.utils.ts#L13)

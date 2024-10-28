---
id: column_getLeafColumns
title: column_getLeafColumns
---

# Function: column\_getLeafColumns()

```ts
function column_getLeafColumns<TFeatures, TData, TValue>(column): Column<TFeatures, TData, TValue>[]
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

[core/columns/Columns.utils.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/Columns.utils.ts#L23)

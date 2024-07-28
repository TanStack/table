---
id: column_getLeafColumns
title: column_getLeafColumns
---

# Function: column\_getLeafColumns()

```ts
function column_getLeafColumns<TFeatures, TData, TValue>(column, table): Column<TFeatures, TData, TValue>[]
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>[]

## Defined in

[core/columns/Columns.utils.ts:26](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/columns/Columns.utils.ts#L26)

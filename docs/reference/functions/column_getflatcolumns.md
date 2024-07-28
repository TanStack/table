---
id: column_getFlatColumns
title: column_getFlatColumns
---

# Function: column\_getFlatColumns()

```ts
function column_getFlatColumns<TFeatures, TData, TValue>(column): Column<TFeatures, TData, TValue>[]
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>[]

## Defined in

[core/columns/Columns.utils.ts:13](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/columns/Columns.utils.ts#L13)

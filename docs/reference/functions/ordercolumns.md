---
id: orderColumns
title: orderColumns
---

# Function: orderColumns()

```ts
function orderColumns<TFeatures, TData>(table, leafColumns): Column<TFeatures, TData, unknown>[]
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **leafColumns**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Defined in

[features/column-ordering/ColumnOrdering.utils.ts:104](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-ordering/ColumnOrdering.utils.ts#L104)

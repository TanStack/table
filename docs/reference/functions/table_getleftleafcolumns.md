---
id: table_getLeftLeafColumns
title: table_getLeftLeafColumns
---

# Function: table\_getLeftLeafColumns()

```ts
function table_getLeftLeafColumns<TFeatures, TData>(table): Column<TFeatures, TData, unknown>[]
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Defined in

[features/column-pinning/ColumnPinning.utils.ts:178](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.utils.ts#L178)

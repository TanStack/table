---
id: table_getAllFlatColumnsById
title: table_getAllFlatColumnsById
---

# Function: table\_getAllFlatColumnsById()

```ts
function table_getAllFlatColumnsById<TFeatures, TData>(table): Record<string, Column<TFeatures, TData, unknown>>
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

`Record`\<`string`, [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>\>

## Defined in

[core/columns/Columns.utils.ts:112](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/columns/Columns.utils.ts#L112)

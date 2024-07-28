---
id: row_getAllCellsByColumnId
title: row_getAllCellsByColumnId
---

# Function: row\_getAllCellsByColumnId()

```ts
function row_getAllCellsByColumnId<TFeatures, TData>(row, table): Record<string, Cell<TFeatures, TData, unknown>>
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

`Record`\<`string`, [`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `unknown`\>\>

## Defined in

[core/rows/Rows.utils.ts:123](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/rows/Rows.utils.ts#L123)

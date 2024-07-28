---
id: row_getParentRow
title: row_getParentRow
---

# Function: row\_getParentRow()

```ts
function row_getParentRow<TFeatures, TData>(row, table): undefined | Row<TFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

`undefined` \| [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

## Defined in

[core/rows/Rows.utils.ts:88](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/rows/Rows.utils.ts#L88)

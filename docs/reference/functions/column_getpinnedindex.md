---
id: column_getPinnedIndex
title: column_getPinnedIndex
---

# Function: column\_getPinnedIndex()

```ts
function column_getPinnedIndex<TFeatures, TData, TValue>(column, table): number
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

`number`

## Defined in

[features/column-pinning/ColumnPinning.utils.ts:92](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.utils.ts#L92)
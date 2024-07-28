---
id: column_resetSize
title: column_resetSize
---

# Function: column\_resetSize()

```ts
function column_resetSize<TFeatures, TData, TValue>(table, column): void
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`void`

## Defined in

[features/column-sizing/ColumnSizing.utils.ts:67](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-sizing/ColumnSizing.utils.ts#L67)

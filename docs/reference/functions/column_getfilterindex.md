---
id: column_getFilterIndex
title: column_getFilterIndex
---

# Function: column\_getFilterIndex()

```ts
function column_getFilterIndex<TFeatures, TData, TValue>(column, table): number
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

[features/column-filtering/ColumnFiltering.utils.ts:91](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.utils.ts#L91)

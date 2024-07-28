---
id: column_setFilterValue
title: column_setFilterValue
---

# Function: column\_setFilterValue()

```ts
function column_setFilterValue<TFeatures, TData, TValue>(
   column, 
   table, 
   value): void
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **value**: `any`

## Returns

`void`

## Defined in

[features/column-filtering/ColumnFiltering.utils.ts:106](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.utils.ts#L106)

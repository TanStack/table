---
id: column_getAutoFilterFn
title: column_getAutoFilterFn
---

# Function: column\_getAutoFilterFn()

```ts
function column_getAutoFilterFn<TFeatures, TData, TValue>(column, table): FilterFn<any, any>
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

[`FilterFn`](../interfaces/filterfn.md)\<`any`, `any`\>

## Defined in

[features/column-filtering/ColumnFiltering.utils.ts:16](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.utils.ts#L16)

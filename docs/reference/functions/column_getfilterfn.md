---
id: column_getFilterFn
title: column_getFilterFn
---

# Function: column\_getFilterFn()

```ts
function column_getFilterFn<TFeatures, TData, TValue>(column, table): undefined | FilterFn<any, any> | FilterFn<TableFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

`undefined` \| [`FilterFn`](../interfaces/filterfn.md)\<`any`, `any`\> \| [`FilterFn`](../interfaces/filterfn.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\>

## Defined in

[features/column-filtering/ColumnFiltering.utils.ts:48](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.utils.ts#L48)

---
id: shouldAutoRemoveFilter
title: shouldAutoRemoveFilter
---

# Function: shouldAutoRemoveFilter()

```ts
function shouldAutoRemoveFilter<TFeatures, TData, TValue>(
   filterFn?, 
   value?, 
   column?): boolean
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **filterFn?**: [`FilterFn`](../interfaces/filterfn.md)\<`TFeatures`, `TData`\>

• **value?**: `any`

• **column?**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`boolean`

## Defined in

[features/column-filtering/ColumnFiltering.utils.ts:204](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.utils.ts#L204)

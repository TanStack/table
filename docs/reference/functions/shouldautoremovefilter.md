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

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **filterFn?**: [`FilterFn`](../interfaces/filterfn.md)\<`TFeatures`, `TData`\>

• **value?**: `any`

• **column?**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`boolean`

## Defined in

[features/column-filtering/ColumnFiltering.utils.ts:210](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.utils.ts#L210)

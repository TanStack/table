---
id: column_getAutoFilterFn
title: column_getAutoFilterFn
---

# Function: column\_getAutoFilterFn()

```ts
function column_getAutoFilterFn<TFeatures, TData, TValue>(column): undefined | FilterFn<TFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`undefined` \| [`FilterFn`](../interfaces/filterfn.md)\<`TFeatures`, `TData`\>

## Defined in

[features/column-filtering/ColumnFiltering.utils.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.utils.ts#L16)

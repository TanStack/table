---
id: column_toggleSorting
title: column_toggleSorting
---

# Function: column\_toggleSorting()

```ts
function column_toggleSorting<TFeatures, TData, TValue>(
   column, 
   desc?, 
   multi?): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column_Internal`](../type-aliases/column_internal.md)\<`TFeatures`, `TData`, `TValue`\>

• **desc?**: `boolean`

• **multi?**: `boolean`

## Returns

`void`

## Defined in

[features/row-sorting/RowSorting.utils.ts:104](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.utils.ts#L104)

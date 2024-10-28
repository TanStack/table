---
id: column_toggleGrouping
title: column_toggleGrouping
---

# Function: column\_toggleGrouping()

```ts
function column_toggleGrouping<TFeatures, TData, TValue>(column): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`void`

## Defined in

[features/column-grouping/ColumnGrouping.utils.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.utils.ts#L20)

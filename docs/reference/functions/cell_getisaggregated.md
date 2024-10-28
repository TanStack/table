---
id: cell_getIsAggregated
title: cell_getIsAggregated
---

# Function: cell\_getIsAggregated()

```ts
function cell_getIsAggregated<TFeatures, TData, TValue>(cell): boolean
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **cell**: [`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`boolean`

## Defined in

[features/column-grouping/ColumnGrouping.utils.ts:209](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.utils.ts#L209)

---
id: row_getGroupingValue
title: row_getGroupingValue
---

# Function: row\_getGroupingValue()

```ts
function row_getGroupingValue<TFeatures, TData>(row, columnId): any
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **row**: [`Row_Row`](../interfaces/row_row.md)\<`TFeatures`, `TData`\> & [`UnionToIntersection`](../type-aliases/uniontointersection.md)\<
  \| `"ColumnFiltering"` *extends* keyof `TFeatures` ? [`Row_ColumnFiltering`](../interfaces/row_columnfiltering.md)\<`TFeatures`, `TData`\> : `never`
  \| `"ColumnGrouping"` *extends* keyof `TFeatures` ? [`Row_ColumnGrouping`](../interfaces/row_columngrouping.md) : `never`
  \| `"ColumnPinning"` *extends* keyof `TFeatures` ? [`Row_ColumnPinning`](../interfaces/row_columnpinning.md)\<`TFeatures`, `TData`\> : `never`
  \| `"ColumnVisibility"` *extends* keyof `TFeatures` ? [`Row_ColumnVisibility`](../interfaces/row_columnvisibility.md)\<`TFeatures`, `TData`\> : `never`
  \| `"RowExpanding"` *extends* keyof `TFeatures` ? [`Row_RowExpanding`](../interfaces/row_rowexpanding.md) : `never`
  \| `"RowPinning"` *extends* keyof `TFeatures` ? [`Row_RowPinning`](../interfaces/row_rowpinning.md) : `never`
  \| `"RowSelection"` *extends* keyof `TFeatures` ? [`Row_RowSelection`](../interfaces/row_rowselection.md) : `never`\> & `Partial`\<[`Row_ColumnGrouping`](../interfaces/row_columngrouping.md)\>

• **columnId**: `string`

## Returns

`any`

## Defined in

[features/column-grouping/ColumnGrouping.utils.ts:162](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.utils.ts#L162)

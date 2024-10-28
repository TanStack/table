---
id: column_getToggleGroupingHandler
title: column_getToggleGroupingHandler
---

# Function: column\_getToggleGroupingHandler()

```ts
function column_getToggleGroupingHandler<TFeatures, TData, TValue>(column): () => void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column_Column`](../interfaces/column_column.md)\<`TFeatures`, `TData`, `TValue`\> & [`UnionToIntersection`](../type-aliases/uniontointersection.md)\<
  \| `"ColumnFaceting"` *extends* keyof `TFeatures` ? [`Column_ColumnFaceting`](../interfaces/column_columnfaceting.md)\<`TFeatures`, `TData`\> : `never`
  \| `"ColumnFiltering"` *extends* keyof `TFeatures` ? [`Column_ColumnFiltering`](../interfaces/column_columnfiltering.md)\<`TFeatures`, `TData`\> : `never`
  \| `"ColumnGrouping"` *extends* keyof `TFeatures` ? [`Column_ColumnGrouping`](../interfaces/column_columngrouping.md)\<`TFeatures`, `TData`\> : `never`
  \| `"ColumnOrdering"` *extends* keyof `TFeatures` ? [`Column_ColumnOrdering`](../interfaces/column_columnordering.md) : `never`
  \| `"ColumnPinning"` *extends* keyof `TFeatures` ? [`Column_ColumnPinning`](../interfaces/column_columnpinning.md) : `never`
  \| `"ColumnResizing"` *extends* keyof `TFeatures` ? [`Column_ColumnResizing`](../interfaces/column_columnresizing.md) : `never`
  \| `"ColumnSizing"` *extends* keyof `TFeatures` ? [`Column_ColumnSizing`](../interfaces/column_columnsizing.md) : `never`
  \| `"ColumnVisibility"` *extends* keyof `TFeatures` ? [`Column_ColumnVisibility`](../interfaces/column_columnvisibility.md) : `never`
  \| `"GlobalFiltering"` *extends* keyof `TFeatures` ? [`Column_GlobalFiltering`](../interfaces/column_globalfiltering.md) : `never`
  \| `"RowSorting"` *extends* keyof `TFeatures` ? [`Column_RowSorting`](../interfaces/column_rowsorting.md)\<`TFeatures`, `TData`\> : `never`\> & `object`

## Returns

`Function`

### Returns

`void`

## Defined in

[features/column-grouping/ColumnGrouping.utils.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.utils.ts#L75)

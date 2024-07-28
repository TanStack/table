---
id: column_getCanMultiSort
title: column_getCanMultiSort
---

# Function: column\_getCanMultiSort()

```ts
function column_getCanMultiSort<TFeatures, TData, TValue>(column, table): boolean
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column_Column`](../interfaces/column_column.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`, `TValue`\> & [`Column_ColumnOrdering`](../interfaces/column_columnordering.md) & [`Column_ColumnPinning`](../interfaces/column_columnpinning.md) & [`Column_ColumnResizing`](../interfaces/column_columnresizing.md) & [`Column_ColumnSizing`](../interfaces/column_columnsizing.md) & [`Column_ColumnVisibility`](../interfaces/column_columnvisibility.md) & [`Column_GlobalFiltering`](../interfaces/column_globalfiltering.md) & [`Column_ColumnFaceting`](../interfaces/column_columnfaceting.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Column_ColumnFiltering`](../interfaces/column_columnfiltering.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Column_ColumnGrouping`](../interfaces/column_columngrouping.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Column_RowSorting`](../interfaces/column_rowsorting.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & `object`

• **table**: [`Table_Core`](../interfaces/table_core.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_ColumnResizing`](../interfaces/table_columnresizing.md) & [`Table_ColumnSizing`](../interfaces/table_columnsizing.md) & [`Table_ColumnFiltering`](../interfaces/table_columnfiltering.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_ColumnGrouping`](../interfaces/table_columngrouping.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_ColumnOrdering`](../interfaces/table_columnordering.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_ColumnPinning`](../interfaces/table_columnpinning.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_ColumnVisibility`](../interfaces/table_columnvisibility.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_GlobalFaceting`](../interfaces/table_globalfaceting.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_GlobalFiltering`](../interfaces/table_globalfiltering.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_RowExpanding`](../interfaces/table_rowexpanding.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_RowPagination`](../interfaces/table_rowpagination.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_RowPinning`](../interfaces/table_rowpinning.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_RowSelection`](../interfaces/table_rowselection.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_RowSorting`](../interfaces/table_rowsorting.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & `object`

## Returns

`boolean`

## Defined in

[features/row-sorting/RowSorting.utils.ts:364](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.utils.ts#L364)

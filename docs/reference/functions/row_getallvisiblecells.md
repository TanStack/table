---
id: row_getAllVisibleCells
title: row_getAllVisibleCells
---

# Function: row\_getAllVisibleCells()

```ts
function row_getAllVisibleCells<TFeatures, TData>(row, table): Cell<TFeatures, TData, unknown>[]
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

• **table**: [`Table_Core`](../interfaces/table_core.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_ColumnResizing`](../interfaces/table_columnresizing.md) & [`Table_ColumnSizing`](../interfaces/table_columnsizing.md) & [`Table_ColumnFiltering`](../interfaces/table_columnfiltering.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_ColumnGrouping`](../interfaces/table_columngrouping.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_ColumnOrdering`](../interfaces/table_columnordering.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_ColumnPinning`](../interfaces/table_columnpinning.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_ColumnVisibility`](../interfaces/table_columnvisibility.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_GlobalFaceting`](../interfaces/table_globalfaceting.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_GlobalFiltering`](../interfaces/table_globalfiltering.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_RowExpanding`](../interfaces/table_rowexpanding.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_RowPagination`](../interfaces/table_rowpagination.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_RowPinning`](../interfaces/table_rowpinning.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_RowSelection`](../interfaces/table_rowselection.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & [`Table_RowSorting`](../interfaces/table_rowsorting.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\> & `object`

## Returns

[`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Defined in

[features/column-visibility/ColumnVisibility.utils.ts:121](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-visibility/ColumnVisibility.utils.ts#L121)

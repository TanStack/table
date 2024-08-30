---
id: _Table
title: _Table
---

# Type Alias: \_Table\<TFeatures, TData\>

```ts
type _Table<TFeatures, TData>: Table_Core<TFeatures, TData> & UnionToIntersection<
  | "ColumnFiltering" extends keyof TFeatures ? Table_ColumnFiltering<TFeatures, TData> : never
  | "ColumnGrouping" extends keyof TFeatures ? Table_ColumnGrouping<TFeatures, TData> : never
  | "ColumnOrdering" extends keyof TFeatures ? Table_ColumnOrdering<TFeatures, TData> : never
  | "ColumnPinning" extends keyof TFeatures ? Table_ColumnPinning<TFeatures, TData> : never
  | "ColumnResizing" extends keyof TFeatures ? Table_ColumnResizing : never
  | "ColumnSizing" extends keyof TFeatures ? Table_ColumnSizing : never
  | "ColumnVisibility" extends keyof TFeatures ? Table_ColumnVisibility<TFeatures, TData> : never
  | "GlobalFaceting" extends keyof TFeatures ? Table_GlobalFaceting<TFeatures, TData> : never
  | "GlobalFiltering" extends keyof TFeatures ? Table_GlobalFiltering<TFeatures, TData> : never
  | "RowExpanding" extends keyof TFeatures ? Table_RowExpanding<TFeatures, TData> : never
  | "RowPagination" extends keyof TFeatures ? Table_RowPagination<TFeatures, TData> : never
  | "RowPinning" extends keyof TFeatures ? Table_RowPinning<TFeatures, TData> : never
  | "RowSelection" extends keyof TFeatures ? Table_RowSelection<TFeatures, TData> : never
| "RowSorting" extends keyof TFeatures ? Table_RowSorting<TFeatures, TData> : never>;
```

The table object that includes both the core table functionality and the features that are enabled via the `_features` table option.

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Defined in

[types/Table.ts:37](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/types/Table.ts#L37)
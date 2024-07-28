---
id: _TableOptions
title: _TableOptions
---

# Type Alias: \_TableOptions\<TFeatures, TData\>

```ts
type _TableOptions<TFeatures, TData>: TableOptions_Core<TFeatures, TData> & UnionToIntersection<
  | "ColumnFiltering" extends keyof TFeatures ? TableOptions_ColumnFiltering<TFeatures, TData> : never
  | "ColumnGrouping" extends keyof TFeatures ? TableOptions_ColumnGrouping<TFeatures, TData> : never
  | "ColumnOrdering" extends keyof TFeatures ? TableOptions_ColumnOrdering : never
  | "ColumnPinning" extends keyof TFeatures ? TableOptions_ColumnPinning : never
  | "ColumnResizing" extends keyof TFeatures ? TableOptions_ColumnResizing : never
  | "ColumnSizing" extends keyof TFeatures ? TableOptions_ColumnSizing : never
  | "ColumnVisibility" extends keyof TFeatures ? TableOptions_ColumnVisibility : never
  | "GlobalFiltering" extends keyof TFeatures ? TableOptions_GlobalFiltering<TFeatures, TData> : never
  | "RowExpanding" extends keyof TFeatures ? TableOptions_RowExpanding<TFeatures, TData> : never
  | "RowPagination" extends keyof TFeatures ? TableOptions_RowPagination : never
  | "RowPinning" extends keyof TFeatures ? TableOptions_RowPinning<TFeatures, TData> : never
  | "RowSelection" extends keyof TFeatures ? TableOptions_RowSelection<TFeatures, TData> : never
| "RowSorting" extends keyof TFeatures ? TableOptions_RowSorting<TFeatures, TData> : never>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Defined in

[types/TableOptions.ts:31](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/types/TableOptions.ts#L31)

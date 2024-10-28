---
id: TableOptions
title: TableOptions
---

# Type Alias: TableOptions\<TFeatures, TData\>

```ts
type TableOptions<TFeatures, TData>: TableOptions_Core<TFeatures, TData> & UnionToIntersection<
  | "ColumnFiltering" extends keyof TFeatures ? TableOptions_ColumnFiltering<TFeatures, TData> : never
  | "ColumnGrouping" extends keyof TFeatures ? TableOptions_ColumnGrouping : never
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
| "RowSorting" extends keyof TFeatures ? TableOptions_RowSorting : never>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Defined in

[types/TableOptions.ts:31](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableOptions.ts#L31)

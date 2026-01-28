---
id: Table
title: Table
---

# Type Alias: Table\<TFeatures, TData\>

```ts
type Table<TFeatures, TData> = Table_Core<TFeatures, TData> & UnionToIntersection<
  | "columnFilteringFeature" extends keyof TFeatures ? Table_ColumnFiltering : never
  | "columnGroupingFeature" extends keyof TFeatures ? Table_ColumnGrouping<TFeatures, TData> : never
  | "columnOrderingFeature" extends keyof TFeatures ? Table_ColumnOrdering<TFeatures, TData> : never
  | "columnPinningFeature" extends keyof TFeatures ? Table_ColumnPinning<TFeatures, TData> : never
  | "columnResizingFeature" extends keyof TFeatures ? Table_ColumnResizing : never
  | "columnSizingFeature" extends keyof TFeatures ? Table_ColumnSizing : never
  | "columnVisibilityFeature" extends keyof TFeatures ? Table_ColumnVisibility<TFeatures, TData> : never
  | "columnFacetingFeature" extends keyof TFeatures ? Table_ColumnFaceting<TFeatures, TData> : never
  | "globalFilteringFeature" extends keyof TFeatures ? Table_GlobalFiltering<TFeatures, TData> : never
  | "rowExpandingFeature" extends keyof TFeatures ? Table_RowExpanding<TFeatures, TData> : never
  | "rowPaginationFeature" extends keyof TFeatures ? Table_RowPagination<TFeatures, TData> : never
  | "rowPinningFeature" extends keyof TFeatures ? Table_RowPinning<TFeatures, TData> : never
  | "rowSelectionFeature" extends keyof TFeatures ? Table_RowSelection<TFeatures, TData> : never
| "rowSortingFeature" extends keyof TFeatures ? Table_RowSorting<TFeatures, TData> : never> & ExtractFeatureTypes<"Table", TFeatures> & Table_Plugins<TFeatures, TData>;
```

Defined in: [packages/table-core/src/types/Table.ts:53](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Table.ts#L53)

The table object that includes both the core table functionality and the features that are enabled via the `_features` table option.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

---
id: TableOptions
title: TableOptions
---

# Type Alias: TableOptions\<TFeatures, TData\>

```ts
type TableOptions<TFeatures, TData> = TableOptions_Core<TFeatures, TData> & UnionToIntersection<
  | "columnFilteringFeature" extends keyof TFeatures ? TableOptions_ColumnFiltering<TFeatures, TData> : never
  | "columnGroupingFeature" extends keyof TFeatures ? TableOptions_ColumnGrouping : never
  | "columnOrderingFeature" extends keyof TFeatures ? TableOptions_ColumnOrdering : never
  | "columnPinningFeature" extends keyof TFeatures ? TableOptions_ColumnPinning : never
  | "columnResizingFeature" extends keyof TFeatures ? TableOptions_ColumnResizing : never
  | "columnSizingFeature" extends keyof TFeatures ? TableOptions_ColumnSizing : never
  | "columnVisibilityFeature" extends keyof TFeatures ? TableOptions_ColumnVisibility : never
  | "globalFilteringFeature" extends keyof TFeatures ? TableOptions_GlobalFiltering<TFeatures, TData> : never
  | "rowExpandingFeature" extends keyof TFeatures ? TableOptions_RowExpanding<TFeatures, TData> : never
  | "rowPaginationFeature" extends keyof TFeatures ? TableOptions_RowPagination : never
  | "rowPinningFeature" extends keyof TFeatures ? TableOptions_RowPinning<TFeatures, TData> : never
  | "rowSelectionFeature" extends keyof TFeatures ? TableOptions_RowSelection<TFeatures, TData> : never
| "rowSortingFeature" extends keyof TFeatures ? TableOptions_RowSorting : never> & ExtractFeatureTypes<"TableOptions", TFeatures> & TableOptions_Plugins<TFeatures, TData> & DebugOptions<TFeatures>;
```

Defined in: [packages/table-core/src/types/TableOptions.ts:51](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableOptions.ts#L51)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

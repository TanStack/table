---
id: TableState
title: TableState
---

# Type Alias: TableState\<TFeatures\>

```ts
type TableState<TFeatures> = UnionToIntersection<
  | "columnFilteringFeature" extends keyof TFeatures ? TableState_ColumnFiltering : never
  | "columnGroupingFeature" extends keyof TFeatures ? TableState_ColumnGrouping : never
  | "columnOrderingFeature" extends keyof TFeatures ? TableState_ColumnOrdering : never
  | "columnPinningFeature" extends keyof TFeatures ? TableState_ColumnPinning : never
  | "columnResizingFeature" extends keyof TFeatures ? TableState_ColumnResizing : never
  | "columnSizingFeature" extends keyof TFeatures ? TableState_ColumnSizing : never
  | "columnVisibilityFeature" extends keyof TFeatures ? TableState_ColumnVisibility : never
  | "globalFilteringFeature" extends keyof TFeatures ? TableState_GlobalFiltering : never
  | "rowExpandingFeature" extends keyof TFeatures ? TableState_RowExpanding : never
  | "rowPaginationFeature" extends keyof TFeatures ? TableState_RowPagination : never
  | "rowPinningFeature" extends keyof TFeatures ? TableState_RowPinning : never
  | "rowSelectionFeature" extends keyof TFeatures ? TableState_RowSelection : never
| "rowSortingFeature" extends keyof TFeatures ? TableState_RowSorting : never> & ExtractFeatureTypes<"TableState", TFeatures> & TableState_Plugins<TFeatures>;
```

Defined in: [packages/table-core/src/types/TableState.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableState.ts#L23)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

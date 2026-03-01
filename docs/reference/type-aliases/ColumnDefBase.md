---
id: ColumnDefBase
title: ColumnDefBase
---

# Type Alias: ColumnDefBase\<TFeatures, TData, TValue\>

```ts
type ColumnDefBase<TFeatures, TData, TValue> = ColumnDefBase_Core<TFeatures, TData, TValue> & UnionToIntersection<
  | "columnVisibilityFeature" extends keyof TFeatures ? ColumnDef_ColumnVisibility : never
  | "columnPinningFeature" extends keyof TFeatures ? ColumnDef_ColumnPinning : never
  | "columnFilteringFeature" extends keyof TFeatures ? ColumnDef_ColumnFiltering<TFeatures, TData> : never
  | "globalFilteringFeature" extends keyof TFeatures ? ColumnDef_GlobalFiltering : never
  | "rowSortingFeature" extends keyof TFeatures ? ColumnDef_RowSorting<TFeatures, TData> : never
  | "columnGroupingFeature" extends keyof TFeatures ? ColumnDef_ColumnGrouping<TFeatures, TData, TValue> : never
  | "columnSizingFeature" extends keyof TFeatures ? ColumnDef_ColumnSizing : never
| "columnResizingFeature" extends keyof TFeatures ? ColumnDef_ColumnResizing : never> & ExtractFeatureTypes<"ColumnDef", TFeatures> & ColumnDef_Plugins<TFeatures, TData, TValue>;
```

Defined in: [types/ColumnDef.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L75)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` *extends* [`CellData`](CellData.md) = [`CellData`](CellData.md)

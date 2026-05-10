---
id: Column
title: Column
---

# Type Alias: Column\<TFeatures, TData, TValue\>

```ts
type Column<TFeatures, TData, TValue> = Column_Core<TFeatures, TData, TValue> & UnionToIntersection<
  | "columnFacetingFeature" extends keyof TFeatures ? Column_ColumnFaceting<TFeatures, TData> : never
  | "columnFilteringFeature" extends keyof TFeatures ? Column_ColumnFiltering<TFeatures, TData> : never
  | "columnGroupingFeature" extends keyof TFeatures ? Column_ColumnGrouping<TFeatures, TData> : never
  | "columnOrderingFeature" extends keyof TFeatures ? Column_ColumnOrdering : never
  | "columnPinningFeature" extends keyof TFeatures ? Column_ColumnPinning : never
  | "columnResizingFeature" extends keyof TFeatures ? Column_ColumnResizing : never
  | "columnSizingFeature" extends keyof TFeatures ? Column_ColumnSizing : never
  | "columnVisibilityFeature" extends keyof TFeatures ? Column_ColumnVisibility : never
  | "globalFilteringFeature" extends keyof TFeatures ? Column_GlobalFiltering : never
| "rowSortingFeature" extends keyof TFeatures ? Column_RowSorting<TFeatures, TData> : never> & ExtractFeatureTypes<"Column", TFeatures> & Column_Plugins<TFeatures, TData, TValue>;
```

Defined in: [types/Column.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Column.ts#L32)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` = `unknown`

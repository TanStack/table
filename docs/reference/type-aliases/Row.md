---
id: Row
title: Row
---

# Type Alias: Row\<TFeatures, TData\>

```ts
type Row<TFeatures, TData> = Row_Core<TFeatures, TData> & UnionToIntersection<
  | "columnFilteringFeature" extends keyof TFeatures ? Row_ColumnFiltering<TFeatures, TData> : never
  | "columnGroupingFeature" extends keyof TFeatures ? Row_ColumnGrouping : never
  | "columnPinningFeature" extends keyof TFeatures ? Row_ColumnPinning<TFeatures, TData> : never
  | "columnVisibilityFeature" extends keyof TFeatures ? Row_ColumnVisibility<TFeatures, TData> : never
  | "rowExpandingFeature" extends keyof TFeatures ? Row_RowExpanding : never
  | "rowPinningFeature" extends keyof TFeatures ? Row_RowPinning : never
| "rowSelectionFeature" extends keyof TFeatures ? Row_RowSelection : never> & ExtractFeatureTypes<"Row", TFeatures> & Row_Plugins<TFeatures, TData>;
```

Defined in: [packages/table-core/src/types/Row.ts:26](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Row.ts#L26)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

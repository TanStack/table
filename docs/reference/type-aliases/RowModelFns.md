---
id: RowModelFns
title: RowModelFns
---

# Type Alias: RowModelFns\<TFeatures, TData\>

```ts
type RowModelFns<TFeatures, TData> = Partial<UnionToIntersection<
  | "columnFilteringFeature" extends keyof TFeatures ? RowModelFns_ColumnFiltering<TFeatures, TData> : never
  | "columnGroupingFeature" extends keyof TFeatures ? RowModelFns_ColumnGrouping<TFeatures, TData> : never
| "rowSortingFeature" extends keyof TFeatures ? RowModelFns_RowSorting<TFeatures, TData> : never> & ExtractFeatureTypes<"RowModelFns", TFeatures> & RowModelFns_Plugins<TFeatures, TData>>;
```

Defined in: [packages/table-core/src/types/RowModelFns.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModelFns.ts#L18)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

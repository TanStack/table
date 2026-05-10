---
id: CreateRowModels
title: CreateRowModels
---

# Type Alias: CreateRowModels\<TFeatures, TData\>

```ts
type CreateRowModels<TFeatures, TData> = CreateRowModel_Core<TFeatures, TData> & UnionToIntersection<
  | "columnFacetingFeature" extends keyof TFeatures ? CreateRowModel_Faceted<TFeatures, TData> : never
  | "columnFilteringFeature" extends keyof TFeatures ? CreateRowModel_Filtered<TFeatures, TData> : never
  | "rowExpandingFeature" extends keyof TFeatures ? CreateRowModel_Expanded<TFeatures, TData> : never
  | "columnGroupingFeature" extends keyof TFeatures ? CreateRowModel_Grouped<TFeatures, TData> : never
  | "rowPaginationFeature" extends keyof TFeatures ? CreateRowModel_Paginated<TFeatures, TData> : never
| "rowSortingFeature" extends keyof TFeatures ? CreateRowModel_Sorted<TFeatures, TData> : never> & ExtractFeatureTypes<"CreateRowModels", TFeatures> & CreateRowModels_Plugins<TFeatures, TData>;
```

Defined in: [types/RowModel.ts:42](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L42)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

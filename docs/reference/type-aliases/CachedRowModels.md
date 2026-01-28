---
id: CachedRowModels
title: CachedRowModels
---

# Type Alias: CachedRowModels\<TFeatures, TData\>

```ts
type CachedRowModels<TFeatures, TData> = object & UnionToIntersection<
  | "columnFacetingFeature" extends keyof TFeatures ? CachedRowModel_Faceted<TFeatures, TData> : never
  | "columnFilteringFeature" extends keyof TFeatures ? CachedRowModel_Filtered<TFeatures, TData> : never
  | "rowExpandingFeature" extends keyof TFeatures ? CachedRowModel_Expanded<TFeatures, TData> : never
  | "columnGroupingFeature" extends keyof TFeatures ? CachedRowModel_Grouped<TFeatures, TData> : never
  | "rowPaginationFeature" extends keyof TFeatures ? CachedRowModel_Paginated<TFeatures, TData> : never
| "rowSortingFeature" extends keyof TFeatures ? CachedRowModel_Sorted<TFeatures, TData> : never> & ExtractFeatureTypes<"CachedRowModel", TFeatures> & CachedRowModels_Plugins<TFeatures, TData>;
```

Defined in: [packages/table-core/src/types/RowModel.ts:92](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L92)

## Type Declaration

### CachedRowModel\_Core()

```ts
CachedRowModel_Core: () => RowModel<TFeatures, TData>;
```

#### Returns

[`RowModel`](../interfaces/RowModel.md)\<`TFeatures`, `TData`\>

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

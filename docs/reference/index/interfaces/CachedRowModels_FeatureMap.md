---
id: CachedRowModels_FeatureMap
title: CachedRowModels_FeatureMap
---

# Interface: CachedRowModels\_FeatureMap\<TFeatures, TData\>

Defined in: [types/RowModel.ts:14](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L14)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### columnFacetingFeature

```ts
columnFacetingFeature: CachedRowModel_Faceted<TFeatures, TData>;
```

Defined in: [types/RowModel.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L18)

***

### columnFilteringFeature

```ts
columnFilteringFeature: CachedRowModel_Filtered<TFeatures, TData>;
```

Defined in: [types/RowModel.ts:19](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L19)

***

### columnGroupingFeature

```ts
columnGroupingFeature: CachedRowModel_Grouped<TFeatures, TData>;
```

Defined in: [types/RowModel.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L21)

***

### rowExpandingFeature

```ts
rowExpandingFeature: CachedRowModel_Expanded<TFeatures, TData>;
```

Defined in: [types/RowModel.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L20)

***

### rowPaginationFeature

```ts
rowPaginationFeature: CachedRowModel_Paginated<TFeatures, TData>;
```

Defined in: [types/RowModel.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L22)

***

### rowSortingFeature

```ts
rowSortingFeature: CachedRowModel_Sorted<TFeatures, TData>;
```

Defined in: [types/RowModel.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L23)

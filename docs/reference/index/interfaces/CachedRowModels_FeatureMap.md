---
id: CachedRowModels_FeatureMap
title: CachedRowModels_FeatureMap
---

# Interface: CachedRowModels\_FeatureMap\<TFeatures, TData\>

Defined in: [types/RowModel.ts:11](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L11)

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

Defined in: [types/RowModel.ts:15](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L15)

***

### columnFilteringFeature

```ts
columnFilteringFeature: CachedRowModel_Filtered<TFeatures, TData>;
```

Defined in: [types/RowModel.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L16)

***

### columnGroupingFeature

```ts
columnGroupingFeature: CachedRowModel_Grouped<TFeatures, TData>;
```

Defined in: [types/RowModel.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L18)

***

### rowExpandingFeature

```ts
rowExpandingFeature: CachedRowModel_Expanded<TFeatures, TData>;
```

Defined in: [types/RowModel.ts:17](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L17)

***

### rowPaginationFeature

```ts
rowPaginationFeature: CachedRowModel_Paginated<TFeatures, TData>;
```

Defined in: [types/RowModel.ts:19](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L19)

***

### rowSortingFeature

```ts
rowSortingFeature: CachedRowModel_Sorted<TFeatures, TData>;
```

Defined in: [types/RowModel.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L20)

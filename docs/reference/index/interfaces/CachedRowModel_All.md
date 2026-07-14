---
id: CachedRowModel_All
title: CachedRowModel_All
---

# Interface: CachedRowModel\_All\<TFeatures, TData\>

Defined in: [types/RowModel.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L32)

## Extends

- `Partial`\<[`CachedRowModel_Core`](CachedRowModel_Core.md)\<`TFeatures`, `TData`\> & [`CachedRowModel_Expanded`](CachedRowModel_Expanded.md)\<`TFeatures`, `TData`\> & [`CachedRowModel_Faceted`](CachedRowModel_Faceted.md)\<`TFeatures`, `TData`\> & [`CachedRowModel_Filtered`](CachedRowModel_Filtered.md)\<`TFeatures`, `TData`\> & [`CachedRowModel_Grouped`](CachedRowModel_Grouped.md)\<`TFeatures`, `TData`\> & [`CachedRowModel_Paginated`](CachedRowModel_Paginated.md)\<`TFeatures`, `TData`\> & [`CachedRowModel_Sorted`](CachedRowModel_Sorted.md)\<`TFeatures`, `TData`\>\>

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

## Properties

### coreRowModel()?

```ts
optional coreRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [core/row-models/coreRowModelsFeature.types.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts#L24)

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Partial.coreRowModel
```

***

### expandedRowModel()?

```ts
optional expandedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:131](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L131)

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Partial.expandedRowModel
```

***

### facetedMinMaxValues?

```ts
optional facetedMinMaxValues: Record<string, () => [number, number] | undefined>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L55)

#### Inherited from

```ts
Partial.facetedMinMaxValues
```

***

### facetedRowModels?

```ts
optional facetedRowModels: Record<string, () => RowModel<TFeatures, TData>>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:54](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L54)

#### Inherited from

```ts
Partial.facetedRowModels
```

***

### facetedUniqueValues?

```ts
optional facetedUniqueValues: Record<string, () => Map<any, number>>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L56)

#### Inherited from

```ts
Partial.facetedUniqueValues
```

***

### filteredRowModel()?

```ts
optional filteredRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:307](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L307)

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Partial.filteredRowModel
```

***

### globalFacetedMinMaxValues()?

```ts
optional globalFacetedMinMaxValues: () => [number, number] | undefined;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L58)

#### Returns

\[`number`, `number`\] \| `undefined`

#### Inherited from

```ts
Partial.globalFacetedMinMaxValues
```

***

### globalFacetedRowModel()?

```ts
optional globalFacetedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:57](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L57)

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Partial.globalFacetedRowModel
```

***

### globalFacetedUniqueValues()?

```ts
optional globalFacetedUniqueValues: () => Map<any, number>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L59)

#### Returns

`Map`\<`any`, `number`\>

#### Inherited from

```ts
Partial.globalFacetedUniqueValues
```

***

### groupedRowModel()?

```ts
optional groupedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:151](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L151)

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Partial.groupedRowModel
```

***

### paginatedRowModel()?

```ts
optional paginatedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:136](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L136)

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Partial.paginatedRowModel
```

***

### sortedRowModel()?

```ts
optional sortedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:287](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L287)

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Partial.sortedRowModel
```

---
id: CachedRowModel_All
title: CachedRowModel_All
---

# Interface: CachedRowModel\_All\<TFeatures, TData\>

Defined in: [types/RowModel.ts:36](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L36)

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

Defined in: [core/row-models/coreRowModelsFeature.types.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts#L25)

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

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:132](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L132)

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Partial.expandedRowModel
```

***

### facetedMinMaxValues()?

```ts
optional facetedMinMaxValues: (columnId) => [number, number];
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L56)

#### Parameters

##### columnId

`string`

#### Returns

\[`number`, `number`\]

#### Inherited from

```ts
Partial.facetedMinMaxValues
```

***

### facetedRowModel()?

```ts
optional facetedRowModel: (columnId) => () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L55)

#### Parameters

##### columnId

`string`

#### Returns

```ts
(): RowModel<TFeatures, TData>;
```

##### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Partial.facetedRowModel
```

***

### facetedUniqueValues()?

```ts
optional facetedUniqueValues: (columnId) => Map<any, number>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:57](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L57)

#### Parameters

##### columnId

`string`

#### Returns

`Map`\<`any`, `number`\>

#### Inherited from

```ts
Partial.facetedUniqueValues
```

***

### filteredRowModel()?

```ts
optional filteredRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:247](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L247)

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Partial.filteredRowModel
```

***

### groupedRowModel()?

```ts
optional groupedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:233](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L233)

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

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:137](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L137)

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

Defined in: [features/row-sorting/rowSortingFeature.types.ts:235](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L235)

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Partial.sortedRowModel
```

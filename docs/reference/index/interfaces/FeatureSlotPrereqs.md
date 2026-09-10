---
id: FeatureSlotPrereqs
title: FeatureSlotPrereqs
---

# Interface: FeatureSlotPrereqs

Defined in: [types/TableFeatures.ts:94](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L94)

Maps each row model and fn registry slot to the feature(s) that must be
registered alongside it in the same features object.

Custom features can declaration-merge their own slot prerequisites into this
interface to get the same validation from `tableFeatures()`.

## Properties

### aggregationFns

```ts
aggregationFns: "rowAggregationFeature";
```

Defined in: [types/TableFeatures.ts:98](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L98)

Named aggregation functions require the independent aggregation feature.

***

### columnResizingFeature

```ts
columnResizingFeature: "columnSizingFeature";
```

Defined in: [types/TableFeatures.ts:102](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L102)

Column resizing builds on the column sizing state and APIs.

***

### expandedRowModel

```ts
expandedRowModel: "rowExpandingFeature";
```

Defined in: [types/TableFeatures.ts:106](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L106)

Expanded row-model factories require row expanding APIs and state.

***

### facetedMinMaxValues

```ts
facetedMinMaxValues: "columnFacetingFeature";
```

Defined in: [types/TableFeatures.ts:110](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L110)

Faceted min/max factories require column faceting APIs.

***

### facetedRowModel

```ts
facetedRowModel: "columnFacetingFeature";
```

Defined in: [types/TableFeatures.ts:114](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L114)

Faceted row-model factories require column faceting APIs.

***

### facetedUniqueValues

```ts
facetedUniqueValues: "columnFacetingFeature";
```

Defined in: [types/TableFeatures.ts:118](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L118)

Faceted unique-value factories require column faceting APIs.

***

### filteredRowModel

```ts
filteredRowModel: "columnFilteringFeature";
```

Defined in: [types/TableFeatures.ts:122](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L122)

Filtered row-model factories require column filtering APIs and state.

***

### filterFns

```ts
filterFns: "columnFilteringFeature";
```

Defined in: [types/TableFeatures.ts:126](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L126)

Named filter functions are only meaningful when column filtering is enabled.

***

### filterMeta

```ts
filterMeta: "columnFilteringFeature";
```

Defined in: [types/TableFeatures.ts:130](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L130)

Filter metadata types are only read and written by filtering features.

***

### globalFilteringFeature

```ts
globalFilteringFeature: "columnFilteringFeature";
```

Defined in: [types/TableFeatures.ts:134](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L134)

Global filtering builds on column filtering state and filter functions.

***

### groupedRowModel

```ts
groupedRowModel: "columnGroupingFeature";
```

Defined in: [types/TableFeatures.ts:138](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L138)

Grouped row-model factories require column grouping APIs and state.

***

### paginatedRowModel

```ts
paginatedRowModel: "rowPaginationFeature";
```

Defined in: [types/TableFeatures.ts:142](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L142)

Paginated row-model factories require row pagination APIs and state.

***

### sortedRowModel

```ts
sortedRowModel: "rowSortingFeature";
```

Defined in: [types/TableFeatures.ts:146](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L146)

Sorted row-model factories require row sorting APIs and state.

***

### sortFns

```ts
sortFns: "rowSortingFeature";
```

Defined in: [types/TableFeatures.ts:150](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L150)

Named sorting functions are only meaningful when row sorting is enabled.

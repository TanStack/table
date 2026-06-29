---
id: FeatureSlotPrereqs
title: FeatureSlotPrereqs
---

# Interface: FeatureSlotPrereqs

Defined in: [types/TableFeatures.ts:91](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L91)

Maps each row model and fn registry slot to the feature(s) that must be
registered alongside it in the same features object.

Custom features can declaration-merge their own slot prerequisites into this
interface to get the same validation from `tableFeatures()`.

## Properties

### aggregationFns

```ts
aggregationFns: "columnGroupingFeature";
```

Defined in: [types/TableFeatures.ts:95](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L95)

Named aggregation functions are only meaningful when grouping is enabled.

***

### columnResizingFeature

```ts
columnResizingFeature: "columnSizingFeature";
```

Defined in: [types/TableFeatures.ts:99](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L99)

Column resizing builds on the column sizing state and APIs.

***

### expandedRowModel

```ts
expandedRowModel: "rowExpandingFeature";
```

Defined in: [types/TableFeatures.ts:103](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L103)

Expanded row-model factories require row expanding APIs and state.

***

### facetedMinMaxValues

```ts
facetedMinMaxValues: "columnFacetingFeature";
```

Defined in: [types/TableFeatures.ts:107](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L107)

Faceted min/max factories require column faceting APIs.

***

### facetedRowModel

```ts
facetedRowModel: "columnFacetingFeature";
```

Defined in: [types/TableFeatures.ts:111](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L111)

Faceted row-model factories require column faceting APIs.

***

### facetedUniqueValues

```ts
facetedUniqueValues: "columnFacetingFeature";
```

Defined in: [types/TableFeatures.ts:115](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L115)

Faceted unique-value factories require column faceting APIs.

***

### filteredRowModel

```ts
filteredRowModel: "columnFilteringFeature";
```

Defined in: [types/TableFeatures.ts:119](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L119)

Filtered row-model factories require column filtering APIs and state.

***

### filterFns

```ts
filterFns: "columnFilteringFeature";
```

Defined in: [types/TableFeatures.ts:123](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L123)

Named filter functions are only meaningful when column filtering is enabled.

***

### filterMeta

```ts
filterMeta: "columnFilteringFeature";
```

Defined in: [types/TableFeatures.ts:127](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L127)

Filter metadata types are only read and written by filtering features.

***

### globalFilteringFeature

```ts
globalFilteringFeature: "columnFilteringFeature";
```

Defined in: [types/TableFeatures.ts:131](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L131)

Global filtering builds on column filtering state and filter functions.

***

### groupedRowModel

```ts
groupedRowModel: "columnGroupingFeature";
```

Defined in: [types/TableFeatures.ts:135](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L135)

Grouped row-model factories require column grouping APIs and state.

***

### paginatedRowModel

```ts
paginatedRowModel: "rowPaginationFeature";
```

Defined in: [types/TableFeatures.ts:139](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L139)

Paginated row-model factories require row pagination APIs and state.

***

### sortedRowModel

```ts
sortedRowModel: "rowSortingFeature";
```

Defined in: [types/TableFeatures.ts:143](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L143)

Sorted row-model factories require row sorting APIs and state.

***

### sortFns

```ts
sortFns: "rowSortingFeature";
```

Defined in: [types/TableFeatures.ts:147](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L147)

Named sorting functions are only meaningful when row sorting is enabled.

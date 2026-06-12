---
id: FeatureSlotPrereqs
title: FeatureSlotPrereqs
---

# Interface: FeatureSlotPrereqs

Defined in: [types/TableFeatures.ts:63](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L63)

Maps each row model and fn registry slot to the feature(s) that must be
registered alongside it in the same features object.

Custom features can declaration-merge their own slot prerequisites into this
interface to get the same validation from `tableFeatures()`.

## Properties

### aggregationFns

```ts
aggregationFns: "columnGroupingFeature";
```

Defined in: [types/TableFeatures.ts:64](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L64)

***

### expandedRowModel

```ts
expandedRowModel: "rowExpandingFeature";
```

Defined in: [types/TableFeatures.ts:65](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L65)

***

### facetedMinMaxValues

```ts
facetedMinMaxValues: "columnFacetingFeature";
```

Defined in: [types/TableFeatures.ts:66](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L66)

***

### facetedRowModel

```ts
facetedRowModel: "columnFacetingFeature";
```

Defined in: [types/TableFeatures.ts:67](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L67)

***

### facetedUniqueValues

```ts
facetedUniqueValues: "columnFacetingFeature";
```

Defined in: [types/TableFeatures.ts:68](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L68)

***

### filteredRowModel

```ts
filteredRowModel: "columnFilteringFeature" | "globalFilteringFeature";
```

Defined in: [types/TableFeatures.ts:71](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L71)

***

### filterFns

```ts
filterFns: "columnFilteringFeature" | "globalFilteringFeature";
```

Defined in: [types/TableFeatures.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L69)

***

### filterMeta

```ts
filterMeta: "columnFilteringFeature" | "globalFilteringFeature";
```

Defined in: [types/TableFeatures.ts:70](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L70)

***

### groupedRowModel

```ts
groupedRowModel: "columnGroupingFeature";
```

Defined in: [types/TableFeatures.ts:72](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L72)

***

### paginatedRowModel

```ts
paginatedRowModel: "rowPaginationFeature";
```

Defined in: [types/TableFeatures.ts:73](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L73)

***

### sortedRowModel

```ts
sortedRowModel: "rowSortingFeature";
```

Defined in: [types/TableFeatures.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L75)

***

### sortFns

```ts
sortFns: "rowSortingFeature";
```

Defined in: [types/TableFeatures.ts:74](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L74)

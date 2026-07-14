---
id: Column_FeatureMap
title: Column_FeatureMap
---

# Interface: Column\_FeatureMap\<TFeatures, TData\>

Defined in: [types/Column.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Column.ts#L24)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### aggregationFeature

```ts
aggregationFeature: Column_Aggregation<TFeatures, TData>;
```

Defined in: [types/Column.ts:28](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Column.ts#L28)

***

### columnFacetingFeature

```ts
columnFacetingFeature: Column_ColumnFaceting<TFeatures, TData>;
```

Defined in: [types/Column.ts:29](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Column.ts#L29)

***

### columnFilteringFeature

```ts
columnFilteringFeature: Column_ColumnFiltering<TFeatures, TData>;
```

Defined in: [types/Column.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Column.ts#L30)

***

### columnGroupingFeature

```ts
columnGroupingFeature: Column_ColumnGrouping;
```

Defined in: [types/Column.ts:31](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Column.ts#L31)

***

### columnOrderingFeature

```ts
columnOrderingFeature: Column_ColumnOrdering;
```

Defined in: [types/Column.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Column.ts#L32)

***

### columnPinningFeature

```ts
columnPinningFeature: Column_ColumnPinning;
```

Defined in: [types/Column.ts:33](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Column.ts#L33)

***

### columnResizingFeature

```ts
columnResizingFeature: Column_ColumnResizing;
```

Defined in: [types/Column.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Column.ts#L34)

***

### columnSizingFeature

```ts
columnSizingFeature: Column_ColumnSizing;
```

Defined in: [types/Column.ts:35](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Column.ts#L35)

***

### columnVisibilityFeature

```ts
columnVisibilityFeature: Column_ColumnVisibility;
```

Defined in: [types/Column.ts:36](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Column.ts#L36)

***

### globalFilteringFeature

```ts
globalFilteringFeature: Column_GlobalFiltering;
```

Defined in: [types/Column.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Column.ts#L37)

***

### rowSortingFeature

```ts
rowSortingFeature: Column_RowSorting<TFeatures, TData>;
```

Defined in: [types/Column.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Column.ts#L38)

---
id: ColumnDef_FeatureMap
title: ColumnDef_FeatureMap
---

# Interface: ColumnDef\_FeatureMap\<TFeatures, TData, TValue\>

Defined in: [types/ColumnDef.ts:132](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L132)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* [`CellData`](../type-aliases/CellData.md)

## Properties

### cellSelectionFeature

```ts
cellSelectionFeature: ColumnDef_CellSelection;
```

Defined in: [types/ColumnDef.ts:137](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L137)

***

### columnFilteringFeature

```ts
columnFilteringFeature: ColumnDef_ColumnFiltering<TFeatures, TData>;
```

Defined in: [types/ColumnDef.ts:138](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L138)

***

### columnGroupingFeature

```ts
columnGroupingFeature: ColumnDef_ColumnGrouping<TFeatures, TData>;
```

Defined in: [types/ColumnDef.ts:139](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L139)

***

### columnPinningFeature

```ts
columnPinningFeature: ColumnDef_ColumnPinning;
```

Defined in: [types/ColumnDef.ts:140](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L140)

***

### columnResizingFeature

```ts
columnResizingFeature: ColumnDef_ColumnResizing;
```

Defined in: [types/ColumnDef.ts:141](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L141)

***

### columnSizingFeature

```ts
columnSizingFeature: ColumnDef_ColumnSizing;
```

Defined in: [types/ColumnDef.ts:142](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L142)

***

### columnVisibilityFeature

```ts
columnVisibilityFeature: ColumnDef_ColumnVisibility;
```

Defined in: [types/ColumnDef.ts:143](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L143)

***

### globalFilteringFeature

```ts
globalFilteringFeature: ColumnDef_GlobalFiltering;
```

Defined in: [types/ColumnDef.ts:144](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L144)

***

### rowAggregationFeature

```ts
rowAggregationFeature: ColumnDef_RowAggregation<TFeatures, TData, TValue>;
```

Defined in: [types/ColumnDef.ts:145](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L145)

***

### rowSortingFeature

```ts
rowSortingFeature: ColumnDef_RowSorting<TFeatures, TData>;
```

Defined in: [types/ColumnDef.ts:146](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L146)

---
id: ColumnDef_FeatureMap
title: ColumnDef_FeatureMap
---

# Interface: ColumnDef\_FeatureMap\<TFeatures, TData, TValue\>

Defined in: [types/ColumnDef.ts:129](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L129)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* [`CellData`](../type-aliases/CellData.md)

## Properties

### columnFilteringFeature

```ts
columnFilteringFeature: ColumnDef_ColumnFiltering<TFeatures, TData>;
```

Defined in: [types/ColumnDef.ts:136](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L136)

***

### columnGroupingFeature

```ts
columnGroupingFeature: ColumnDef_ColumnGrouping<TFeatures, TData, TValue>;
```

Defined in: [types/ColumnDef.ts:139](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L139)

***

### columnPinningFeature

```ts
columnPinningFeature: ColumnDef_ColumnPinning;
```

Defined in: [types/ColumnDef.ts:135](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L135)

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

Defined in: [types/ColumnDef.ts:140](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L140)

***

### columnVisibilityFeature

```ts
columnVisibilityFeature: ColumnDef_ColumnVisibility;
```

Defined in: [types/ColumnDef.ts:134](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L134)

***

### globalFilteringFeature

```ts
globalFilteringFeature: ColumnDef_GlobalFiltering;
```

Defined in: [types/ColumnDef.ts:137](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L137)

***

### rowSortingFeature

```ts
rowSortingFeature: ColumnDef_RowSorting<TFeatures, TData>;
```

Defined in: [types/ColumnDef.ts:138](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L138)

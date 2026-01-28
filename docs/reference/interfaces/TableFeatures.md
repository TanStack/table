---
id: TableFeatures
title: TableFeatures
---

# Interface: TableFeatures

Defined in: [packages/table-core/src/types/TableFeatures.ts:42](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L42)

## Extends

- `Partial`\<[`CoreFeatures`](CoreFeatures.md)\>.`Partial`\<[`StockFeatures`](StockFeatures.md)\>.`Partial`\<[`Plugins`](Plugins.md)\>

## Properties

### columnFacetingFeature?

```ts
optional columnFacetingFeature: TableFeature<ColumnFacetingFeatureConstructors<TableFeatures, RowData>>;
```

Defined in: [packages/table-core/src/features/stockFeatures.ts:17](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L17)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`columnFacetingFeature`](StockFeatures.md#columnfacetingfeature)

***

### columnFilteringFeature?

```ts
optional columnFilteringFeature: TableFeature<ColumnFilteringFeatureConstructors<TableFeatures, RowData>>;
```

Defined in: [packages/table-core/src/features/stockFeatures.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L18)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`columnFilteringFeature`](StockFeatures.md#columnfilteringfeature)

***

### columnGroupingFeature?

```ts
optional columnGroupingFeature: TableFeature<ColumnGroupingFeatureConstructors<TableFeatures, RowData>>;
```

Defined in: [packages/table-core/src/features/stockFeatures.ts:19](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L19)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`columnGroupingFeature`](StockFeatures.md#columngroupingfeature)

***

### columnOrderingFeature?

```ts
optional columnOrderingFeature: TableFeature<ColumnOrderingFeatureConstructors<TableFeatures, RowData>>;
```

Defined in: [packages/table-core/src/features/stockFeatures.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L20)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`columnOrderingFeature`](StockFeatures.md#columnorderingfeature)

***

### columnPinningFeature?

```ts
optional columnPinningFeature: TableFeature<ColumnPinningFeatureConstructors<TableFeatures, RowData>>;
```

Defined in: [packages/table-core/src/features/stockFeatures.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L21)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`columnPinningFeature`](StockFeatures.md#columnpinningfeature)

***

### columnResizingFeature?

```ts
optional columnResizingFeature: TableFeature<ColumnResizingFeatureConstructors<TableFeatures, RowData>>;
```

Defined in: [packages/table-core/src/features/stockFeatures.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L22)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`columnResizingFeature`](StockFeatures.md#columnresizingfeature)

***

### columnSizingFeature?

```ts
optional columnSizingFeature: TableFeature<ColumnSizingFeatureConstructors<TableFeatures, RowData>>;
```

Defined in: [packages/table-core/src/features/stockFeatures.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L23)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`columnSizingFeature`](StockFeatures.md#columnsizingfeature)

***

### columnVisibilityFeature?

```ts
optional columnVisibilityFeature: TableFeature<ColumnVisibilityFeatureConstructors<TableFeatures, RowData>>;
```

Defined in: [packages/table-core/src/features/stockFeatures.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L24)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`columnVisibilityFeature`](StockFeatures.md#columnvisibilityfeature)

***

### coreCellsFeature?

```ts
optional coreCellsFeature: TableFeature<CoreCellsFeatureConstructors<TableFeatures, RowData>>;
```

Defined in: [packages/table-core/src/core/coreFeatures.ts:9](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/coreFeatures.ts#L9)

#### Inherited from

[`CoreFeatures`](CoreFeatures.md).[`coreCellsFeature`](CoreFeatures.md#corecellsfeature)

***

### coreColumnsFeature?

```ts
optional coreColumnsFeature: TableFeature<CoreColumnsFeatureConstructors<TableFeatures, RowData>>;
```

Defined in: [packages/table-core/src/core/coreFeatures.ts:10](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/coreFeatures.ts#L10)

#### Inherited from

[`CoreFeatures`](CoreFeatures.md).[`coreColumnsFeature`](CoreFeatures.md#corecolumnsfeature)

***

### coreHeadersFeature?

```ts
optional coreHeadersFeature: TableFeature<CoreHeadersFeatureConstructors<TableFeatures, RowData>>;
```

Defined in: [packages/table-core/src/core/coreFeatures.ts:11](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/coreFeatures.ts#L11)

#### Inherited from

[`CoreFeatures`](CoreFeatures.md).[`coreHeadersFeature`](CoreFeatures.md#coreheadersfeature)

***

### coreRowModelsFeature?

```ts
optional coreRowModelsFeature: TableFeature<CoreRowModelsFeatureConstructors<TableFeatures, RowData>>;
```

Defined in: [packages/table-core/src/core/coreFeatures.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/coreFeatures.ts#L12)

#### Inherited from

[`CoreFeatures`](CoreFeatures.md).[`coreRowModelsFeature`](CoreFeatures.md#corerowmodelsfeature)

***

### coreRowsFeature?

```ts
optional coreRowsFeature: TableFeature<CoreRowsFeatureConstructors<TableFeatures, RowData>>;
```

Defined in: [packages/table-core/src/core/coreFeatures.ts:13](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/coreFeatures.ts#L13)

#### Inherited from

[`CoreFeatures`](CoreFeatures.md).[`coreRowsFeature`](CoreFeatures.md#corerowsfeature)

***

### coreTablesFeature?

```ts
optional coreTablesFeature: TableFeature<CoreTablesFeatureConstructors<TableFeatures, RowData>>;
```

Defined in: [packages/table-core/src/core/coreFeatures.ts:14](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/coreFeatures.ts#L14)

#### Inherited from

[`CoreFeatures`](CoreFeatures.md).[`coreTablesFeature`](CoreFeatures.md#coretablesfeature)

***

### globalFilteringFeature?

```ts
optional globalFilteringFeature: TableFeature<GlobalFilteringFeatureConstructors<TableFeatures, RowData>>;
```

Defined in: [packages/table-core/src/features/stockFeatures.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L25)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`globalFilteringFeature`](StockFeatures.md#globalfilteringfeature)

***

### rowExpandingFeature?

```ts
optional rowExpandingFeature: TableFeature<RowExpandingFeatureConstructors<TableFeatures, RowData>>;
```

Defined in: [packages/table-core/src/features/stockFeatures.ts:26](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L26)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`rowExpandingFeature`](StockFeatures.md#rowexpandingfeature)

***

### rowPaginationFeature?

```ts
optional rowPaginationFeature: TableFeature<RowPaginationFeatureConstructors<TableFeatures, RowData>>;
```

Defined in: [packages/table-core/src/features/stockFeatures.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L27)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`rowPaginationFeature`](StockFeatures.md#rowpaginationfeature)

***

### rowPinningFeature?

```ts
optional rowPinningFeature: TableFeature<RowPinningFeatureConstructors<TableFeatures, RowData>>;
```

Defined in: [packages/table-core/src/features/stockFeatures.ts:28](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L28)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`rowPinningFeature`](StockFeatures.md#rowpinningfeature)

***

### rowSelectionFeature?

```ts
optional rowSelectionFeature: TableFeature<RowSelectionFeatureConstructors<TableFeatures, RowData>>;
```

Defined in: [packages/table-core/src/features/stockFeatures.ts:29](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L29)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`rowSelectionFeature`](StockFeatures.md#rowselectionfeature)

***

### rowSortingFeature?

```ts
optional rowSortingFeature: TableFeature<RowSortingFeatureConstructors<TableFeatures, RowData>>;
```

Defined in: [packages/table-core/src/features/stockFeatures.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L30)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`rowSortingFeature`](StockFeatures.md#rowsortingfeature)

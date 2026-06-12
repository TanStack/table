---
id: TableFeatures
title: TableFeatures
---

# Interface: TableFeatures

Defined in: [types/TableFeatures.ts:100](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L100)

## Extends

- `Partial`\<[`CoreFeatures`](CoreFeatures.md)\>.`Partial`\<[`StockFeatures`](StockFeatures.md)\>.`Partial`\<[`Plugins`](Plugins.md)\>

## Properties

### aggregationFns?

```ts
optional aggregationFns: Record<string, AggregationFn<any, any>>;
```

Defined in: [types/TableFeatures.ts:216](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L216)

Registry of aggregation functions available to this table by name.

Keys registered here become the valid string values for `aggregationFn` on
column definitions, with full inference. Spread the exported
`aggregationFns` to register the built-in aggregation functions:
`aggregationFns: { ...aggregationFns, myCustomAggregationFn }`.

***

### columnFacetingFeature?

```ts
optional columnFacetingFeature: TableFeature;
```

Defined in: [features/stockFeatures.ts:17](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L17)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`columnFacetingFeature`](StockFeatures.md#columnfacetingfeature)

***

### columnFilteringFeature?

```ts
optional columnFilteringFeature: TableFeature;
```

Defined in: [features/stockFeatures.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L18)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`columnFilteringFeature`](StockFeatures.md#columnfilteringfeature)

***

### columnGroupingFeature?

```ts
optional columnGroupingFeature: TableFeature;
```

Defined in: [features/stockFeatures.ts:19](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L19)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`columnGroupingFeature`](StockFeatures.md#columngroupingfeature)

***

### columnMeta?

```ts
optional columnMeta: object;
```

Defined in: [types/TableFeatures.ts:122](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L122)

Type-only slot for declaring the type of `columnDef.meta` for all columns
of this table.

Pass a phantom value: `columnMeta: {} as MyColumnMeta`. The value itself is
ignored and stripped from the table's registered features at runtime — only
its type is used, inferred wherever `TFeatures` flows.

When omitted, the global declaration-merged `ColumnMeta` interface applies.

***

### columnOrderingFeature?

```ts
optional columnOrderingFeature: TableFeature;
```

Defined in: [features/stockFeatures.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L20)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`columnOrderingFeature`](StockFeatures.md#columnorderingfeature)

***

### columnPinningFeature?

```ts
optional columnPinningFeature: TableFeature;
```

Defined in: [features/stockFeatures.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L21)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`columnPinningFeature`](StockFeatures.md#columnpinningfeature)

***

### columnResizingFeature?

```ts
optional columnResizingFeature: TableFeature;
```

Defined in: [features/stockFeatures.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L22)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`columnResizingFeature`](StockFeatures.md#columnresizingfeature)

***

### columnSizingFeature?

```ts
optional columnSizingFeature: TableFeature;
```

Defined in: [features/stockFeatures.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L23)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`columnSizingFeature`](StockFeatures.md#columnsizingfeature)

***

### columnVisibilityFeature?

```ts
optional columnVisibilityFeature: TableFeature;
```

Defined in: [features/stockFeatures.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L24)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`columnVisibilityFeature`](StockFeatures.md#columnvisibilityfeature)

***

### coreCellsFeature?

```ts
optional coreCellsFeature: TableFeature;
```

Defined in: [core/coreFeatures.ts:11](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/coreFeatures.ts#L11)

#### Inherited from

[`CoreFeatures`](CoreFeatures.md).[`coreCellsFeature`](CoreFeatures.md#corecellsfeature)

***

### coreColumnsFeature?

```ts
optional coreColumnsFeature: TableFeature;
```

Defined in: [core/coreFeatures.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/coreFeatures.ts#L12)

#### Inherited from

[`CoreFeatures`](CoreFeatures.md).[`coreColumnsFeature`](CoreFeatures.md#corecolumnsfeature)

***

### coreHeadersFeature?

```ts
optional coreHeadersFeature: TableFeature;
```

Defined in: [core/coreFeatures.ts:13](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/coreFeatures.ts#L13)

#### Inherited from

[`CoreFeatures`](CoreFeatures.md).[`coreHeadersFeature`](CoreFeatures.md#coreheadersfeature)

***

### coreReactivityFeature?

```ts
optional coreReactivityFeature: TableReactivityBindings;
```

Defined in: [core/coreFeatures.ts:10](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/coreFeatures.ts#L10)

#### Inherited from

[`CoreFeatures`](CoreFeatures.md).[`coreReactivityFeature`](CoreFeatures.md#corereactivityfeature)

***

### coreRowModel()?

```ts
optional coreRowModel: (table) => () => RowModel<any, any>;
```

Defined in: [types/TableFeatures.ts:139](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L139)

Factory for the table's core (unmodified) row model. Defaults to the
built-in `createCoreRowModel()` when omitted.

#### Parameters

##### table

`any`

#### Returns

```ts
(): RowModel<any, any>;
```

##### Returns

[`RowModel`](RowModel.md)\<`any`, `any`\>

***

### coreRowModelsFeature?

```ts
optional coreRowModelsFeature: TableFeature;
```

Defined in: [core/coreFeatures.ts:14](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/coreFeatures.ts#L14)

#### Inherited from

[`CoreFeatures`](CoreFeatures.md).[`coreRowModelsFeature`](CoreFeatures.md#corerowmodelsfeature)

***

### coreRowsFeature?

```ts
optional coreRowsFeature: TableFeature;
```

Defined in: [core/coreFeatures.ts:15](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/coreFeatures.ts#L15)

#### Inherited from

[`CoreFeatures`](CoreFeatures.md).[`coreRowsFeature`](CoreFeatures.md#corerowsfeature)

***

### coreTablesFeature?

```ts
optional coreTablesFeature: TableFeature;
```

Defined in: [core/coreFeatures.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/coreFeatures.ts#L16)

#### Inherited from

[`CoreFeatures`](CoreFeatures.md).[`coreTablesFeature`](CoreFeatures.md#coretablesfeature)

***

### expandedRowModel()?

```ts
optional expandedRowModel: (table) => () => RowModel<any, any>;
```

Defined in: [types/TableFeatures.ts:163](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L163)

Factory for the client-side expanded row model. Pass the exported
`createExpandedRowModel()` or implement your own. Not needed for
server-side expansion.

#### Parameters

##### table

`any`

#### Returns

```ts
(): RowModel<any, any>;
```

##### Returns

[`RowModel`](RowModel.md)\<`any`, `any`\>

***

### facetedMinMaxValues()?

```ts
optional facetedMinMaxValues: (table, columnId) => () => [number, number] | undefined;
```

Defined in: [types/TableFeatures.ts:181](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L181)

Factory for per-column faceted min/max values. Pass the exported
`createFacetedMinMaxValues()` or implement your own. Not needed for
server-side faceting.

#### Parameters

##### table

`any`

##### columnId

`string`

#### Returns

```ts
(): [number, number] | undefined;
```

##### Returns

\[`number`, `number`\] \| `undefined`

***

### facetedRowModel()?

```ts
optional facetedRowModel: (table, columnId) => () => RowModel<any, any>;
```

Defined in: [types/TableFeatures.ts:175](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L175)

Factory for the per-column faceted row model. Pass the exported
`createFacetedRowModel()` or implement your own. Not needed for
server-side faceting.

#### Parameters

##### table

`any`

##### columnId

`string`

#### Returns

```ts
(): RowModel<any, any>;
```

##### Returns

[`RowModel`](RowModel.md)\<`any`, `any`\>

***

### facetedUniqueValues()?

```ts
optional facetedUniqueValues: (table, columnId) => () => Map<any, number>;
```

Defined in: [types/TableFeatures.ts:190](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L190)

Factory for per-column faceted unique values. Pass the exported
`createFacetedUniqueValues()` or implement your own. Not needed for
server-side faceting.

#### Parameters

##### table

`any`

##### columnId

`string`

#### Returns

```ts
(): Map<any, number>;
```

##### Returns

`Map`\<`any`, `number`\>

***

### filteredRowModel()?

```ts
optional filteredRowModel: (table) => () => RowModel<any, any>;
```

Defined in: [types/TableFeatures.ts:145](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L145)

Factory for the client-side filtered row model. Pass the exported
`createFilteredRowModel()` or implement your own. Not needed for
server-side filtering.

#### Parameters

##### table

`any`

#### Returns

```ts
(): RowModel<any, any>;
```

##### Returns

[`RowModel`](RowModel.md)\<`any`, `any`\>

***

### filterFns?

```ts
optional filterFns: Record<string, FilterFn<any, any>>;
```

Defined in: [types/TableFeatures.ts:199](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L199)

Registry of filter functions available to this table by name.

Keys registered here become the valid string values for `filterFn` on
column definitions and the `globalFilterFn` option, with full inference.
Spread the exported `filterFns` to register the built-in filter functions:
`filterFns: { ...filterFns, myCustomFilterFn }`.

***

### filterMeta?

```ts
optional filterMeta: object;
```

Defined in: [types/TableFeatures.ts:134](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L134)

Type-only slot for declaring the type of the filter meta that filter
functions attach to rows via `addMeta` and that is read back from
`row.columnFiltersMeta`.

Pass a phantom value: `filterMeta: {} as MyFilterMeta` (or
`metaHelper<MyFilterMeta>()`). The value itself is ignored and stripped
from the table's registered features at runtime; only its type is used.

When omitted, the global declaration-merged `FilterMeta` interface applies.

***

### globalFilteringFeature?

```ts
optional globalFilteringFeature: TableFeature;
```

Defined in: [features/stockFeatures.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L25)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`globalFilteringFeature`](StockFeatures.md#globalfilteringfeature)

***

### groupedRowModel()?

```ts
optional groupedRowModel: (table) => () => RowModel<any, any>;
```

Defined in: [types/TableFeatures.ts:151](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L151)

Factory for the client-side grouped row model. Pass the exported
`createGroupedRowModel()` or implement your own. Not needed for
server-side grouping.

#### Parameters

##### table

`any`

#### Returns

```ts
(): RowModel<any, any>;
```

##### Returns

[`RowModel`](RowModel.md)\<`any`, `any`\>

***

### paginatedRowModel()?

```ts
optional paginatedRowModel: (table) => () => RowModel<any, any>;
```

Defined in: [types/TableFeatures.ts:169](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L169)

Factory for the client-side paginated row model. Pass the exported
`createPaginatedRowModel()` or implement your own. Not needed for
server-side pagination.

#### Parameters

##### table

`any`

#### Returns

```ts
(): RowModel<any, any>;
```

##### Returns

[`RowModel`](RowModel.md)\<`any`, `any`\>

***

### rowExpandingFeature?

```ts
optional rowExpandingFeature: TableFeature;
```

Defined in: [features/stockFeatures.ts:26](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L26)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`rowExpandingFeature`](StockFeatures.md#rowexpandingfeature)

***

### rowPaginationFeature?

```ts
optional rowPaginationFeature: TableFeature;
```

Defined in: [features/stockFeatures.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L27)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`rowPaginationFeature`](StockFeatures.md#rowpaginationfeature)

***

### rowPinningFeature?

```ts
optional rowPinningFeature: TableFeature;
```

Defined in: [features/stockFeatures.ts:28](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L28)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`rowPinningFeature`](StockFeatures.md#rowpinningfeature)

***

### rowSelectionFeature?

```ts
optional rowSelectionFeature: TableFeature;
```

Defined in: [features/stockFeatures.ts:29](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L29)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`rowSelectionFeature`](StockFeatures.md#rowselectionfeature)

***

### rowSortingFeature?

```ts
optional rowSortingFeature: TableFeature;
```

Defined in: [features/stockFeatures.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts#L30)

#### Inherited from

[`StockFeatures`](StockFeatures.md).[`rowSortingFeature`](StockFeatures.md#rowsortingfeature)

***

### sortedRowModel()?

```ts
optional sortedRowModel: (table) => () => RowModel<any, any>;
```

Defined in: [types/TableFeatures.ts:157](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L157)

Factory for the client-side sorted row model. Pass the exported
`createSortedRowModel()` or implement your own. Not needed for
server-side sorting.

#### Parameters

##### table

`any`

#### Returns

```ts
(): RowModel<any, any>;
```

##### Returns

[`RowModel`](RowModel.md)\<`any`, `any`\>

***

### sortFns?

```ts
optional sortFns: Record<string, SortFn<any, any>>;
```

Defined in: [types/TableFeatures.ts:207](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L207)

Registry of sorting functions available to this table by name.

Keys registered here become the valid string values for `sortFn` on column
definitions, with full inference. Spread the exported `sortFns` to register
the built-in sorting functions: `sortFns: { ...sortFns, myCustomSortFn }`.

***

### tableMeta?

```ts
optional tableMeta: object;
```

Defined in: [types/TableFeatures.ts:111](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L111)

Type-only slot for declaring the type of this table's `options.meta`.

Pass a phantom value: `tableMeta: {} as MyTableMeta`. The value itself is
ignored and stripped from the table's registered features at runtime — only
its type is used, inferred wherever `TFeatures` flows.

When omitted, the global declaration-merged `TableMeta` interface applies.

---
id: Table_Core
title: Table_Core
---

# Interface: Table\_Core\<TFeatures, TData\>

Defined in: [types/Table.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Table.ts#L41)

The core table object that only includes the core table functionality such as column, header, row, and table APIS.
No features are included.

## Extends

- [`Table_Table`](Table_Table.md)\<`TFeatures`, `TData`\>.[`Table_Columns`](Table_Columns.md)\<`TFeatures`, `TData`\>.[`Table_Rows`](Table_Rows.md)\<`TFeatures`, `TData`\>.[`Table_RowModels`](../type-aliases/Table_RowModels.md)\<`TFeatures`, `TData`\>.[`Table_Headers`](Table_Headers.md)\<`TFeatures`, `TData`\>

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### \_cellInstanceInitFns

```ts
_cellInstanceInitFns: <TFeatures, TData, TValue>(cell) => void[];
```

Defined in: [core/table/coreTablesFeature.types.ts:206](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L206)

Cache of the `initCellInstanceData` functions for features that define one.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Parameters

##### cell

[`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `TValue`\>

#### Returns

`void`

#### Inherited from

[`Table_Table`](Table_Table.md).[`_cellInstanceInitFns`](Table_Table.md#_cellinstanceinitfns)

***

### \_cellPrototype?

```ts
optional _cellPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:210](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L210)

Prototype cache for Cell objects - shared by all cells in this table

#### Inherited from

[`Table_Table`](Table_Table.md).[`_cellPrototype`](Table_Table.md#_cellprototype)

***

### \_columnInstanceInitFns

```ts
_columnInstanceInitFns: <TFeatures, TData, TValue>(column) => void[];
```

Defined in: [core/table/coreTablesFeature.types.ts:214](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L214)

Cache of the `initColumnInstanceData` functions for features that define one.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Parameters

##### column

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `TValue`\>

#### Returns

`void`

#### Inherited from

[`Table_Table`](Table_Table.md).[`_columnInstanceInitFns`](Table_Table.md#_columninstanceinitfns)

***

### \_columnPrototype?

```ts
optional _columnPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:220](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L220)

Prototype cache for Column objects - shared by all columns in this table

#### Inherited from

[`Table_Table`](Table_Table.md).[`_columnPrototype`](Table_Table.md#_columnprototype)

***

### \_features

```ts
readonly _features: Partial<CoreFeatures> & TFeatures;
```

Defined in: [core/table/coreTablesFeature.types.ts:224](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L224)

The features that are enabled for the table.

#### Inherited from

[`Table_Table`](Table_Table.md).[`_features`](Table_Table.md#_features)

***

### \_headerGroupInstanceInitFns

```ts
_headerGroupInstanceInitFns: <TFeatures, TData>(headerGroup) => void[];
```

Defined in: [core/table/coreTablesFeature.types.ts:228](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L228)

Cache of the `initHeaderGroupInstanceData` functions for features that define one.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### headerGroup

[`HeaderGroup`](HeaderGroup.md)\<`TFeatures`, `TData`\>

#### Returns

`void`

#### Inherited from

[`Table_Table`](Table_Table.md).[`_headerGroupInstanceInitFns`](Table_Table.md#_headergroupinstanceinitfns)

***

### \_headerInstanceInitFns

```ts
_headerInstanceInitFns: <TFeatures, TData, TValue>(header) => void[];
```

Defined in: [core/table/coreTablesFeature.types.ts:234](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L234)

Cache of the `initHeaderInstanceData` functions for features that define one.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Parameters

##### header

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `TValue`\>

#### Returns

`void`

#### Inherited from

[`Table_Table`](Table_Table.md).[`_headerInstanceInitFns`](Table_Table.md#_headerinstanceinitfns)

***

### \_headerPrototype?

```ts
optional _headerPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:240](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L240)

Prototype cache for Header objects - shared by all headers in this table

#### Inherited from

[`Table_Table`](Table_Table.md).[`_headerPrototype`](Table_Table.md#_headerprototype)

***

### \_reactivity

```ts
readonly _reactivity: TableReactivityBindings;
```

Defined in: [core/table/coreTablesFeature.types.ts:202](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L202)

Table reactivity bindings for interacting with TanStack Store.

#### Inherited from

[`Table_Table`](Table_Table.md).[`_reactivity`](Table_Table.md#_reactivity)

***

### \_rowInstanceInitFns

```ts
_rowInstanceInitFns: <TFeatures, TData>(row) => void[];
```

Defined in: [core/table/coreTablesFeature.types.ts:256](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L256)

Cache of the `initRowInstanceData` functions for features that define one.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### row

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

#### Returns

`void`

#### Inherited from

[`Table_Table`](Table_Table.md).[`_rowInstanceInitFns`](Table_Table.md#_rowinstanceinitfns)

***

### \_rowModelFns

```ts
readonly _rowModelFns: RowModelFns<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:244](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L244)

The row model processing functions that are used to process the data by features.

#### Inherited from

[`Table_Table`](Table_Table.md).[`_rowModelFns`](Table_Table.md#_rowmodelfns)

***

### \_rowModels

```ts
readonly _rowModels: CachedRowModels<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:248](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L248)

The row models that are enabled for the table.

#### Inherited from

[`Table_Table`](Table_Table.md).[`_rowModels`](Table_Table.md#_rowmodels)

***

### \_rowPrototype?

```ts
optional _rowPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:252](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L252)

Prototype cache for Row objects - shared by all rows in this table

#### Inherited from

[`Table_Table`](Table_Table.md).[`_rowPrototype`](Table_Table.md#_rowprototype)

***

### atoms

```ts
readonly atoms: Atoms<TFeatures>;
```

Defined in: [core/table/coreTablesFeature.types.ts:262](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L262)

The readonly derived atoms for each `TableState` slice. Each derives from
its corresponding `baseAtom` plus, optionally, a per-slice external atom or
external state value (precedence: external atom > external state > base atom).

#### Inherited from

[`Table_Table`](Table_Table.md).[`atoms`](Table_Table.md#atoms)

***

### baseAtoms

```ts
readonly baseAtoms: BaseAtoms<TFeatures>;
```

Defined in: [core/table/coreTablesFeature.types.ts:267](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L267)

The internal writable atoms for each `TableState` slice. This is the library's
single write surface — all state mutations from features land here.

#### Inherited from

[`Table_Table`](Table_Table.md).[`baseAtoms`](Table_Table.md#baseatoms)

***

### getAllColumns()

```ts
getAllColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [core/columns/coreColumnsFeature.types.ts:91](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L91)

Normalizes `options.columns` into the table's nested column hierarchy.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Inherited from

[`Table_Columns`](Table_Columns.md).[`getAllColumns`](Table_Columns.md#getallcolumns)

***

### getAllFlatColumns()

```ts
getAllFlatColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [core/columns/coreColumnsFeature.types.ts:95](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L95)

Flattens the nested column hierarchy, including parent/group columns.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Inherited from

[`Table_Columns`](Table_Columns.md).[`getAllFlatColumns`](Table_Columns.md#getallflatcolumns)

***

### getAllFlatColumnsById()

```ts
getAllFlatColumnsById: () => Record<string, Column<TFeatures, TData, unknown>>;
```

Defined in: [core/columns/coreColumnsFeature.types.ts:83](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L83)

Returns a map of all flat columns by their ID.

#### Returns

`Record`\<`string`, [`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>\>

#### Inherited from

[`Table_Columns`](Table_Columns.md).[`getAllFlatColumnsById`](Table_Columns.md#getallflatcolumnsbyid)

***

### getAllLeafColumns()

```ts
getAllLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [core/columns/coreColumnsFeature.types.ts:99](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L99)

Collects all terminal leaf columns, excluding parent/group columns.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Inherited from

[`Table_Columns`](Table_Columns.md).[`getAllLeafColumns`](Table_Columns.md#getallleafcolumns)

***

### getAllLeafColumnsById()

```ts
getAllLeafColumnsById: () => Record<string, Column<TFeatures, TData, unknown>>;
```

Defined in: [core/columns/coreColumnsFeature.types.ts:103](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L103)

Returns a map of all leaf-node columns by their ID. This does not include parent columns.

#### Returns

`Record`\<`string`, [`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>\>

#### Inherited from

[`Table_Columns`](Table_Columns.md).[`getAllLeafColumnsById`](Table_Columns.md#getallleafcolumnsbyid)

***

### getColumn()

```ts
getColumn: (columnId) => 
  | Column<TFeatures, TData, unknown>
  | undefined;
```

Defined in: [core/columns/coreColumnsFeature.types.ts:107](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L107)

Returns a single column by its ID.

#### Parameters

##### columnId

`string`

#### Returns

  \| [`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>
  \| `undefined`

#### Inherited from

[`Table_Columns`](Table_Columns.md).[`getColumn`](Table_Columns.md#getcolumn)

***

### getCoreRowModel()

```ts
getCoreRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [core/row-models/coreRowModelsFeature.types.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts#L34)

Returns the core row model before any processing has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Table_RowModels.getCoreRowModel
```

***

### getDefaultColumnDef()

```ts
getDefaultColumnDef: () => Partial<ColumnDef<TFeatures, TData, unknown>>;
```

Defined in: [core/columns/coreColumnsFeature.types.ts:87](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L87)

Resolves built-in, feature-level, and user-defined default column options.

#### Returns

`Partial`\<[`ColumnDef`](../type-aliases/ColumnDef.md)\<`TFeatures`, `TData`, `unknown`\>\>

#### Inherited from

[`Table_Columns`](Table_Columns.md).[`getDefaultColumnDef`](Table_Columns.md#getdefaultcolumndef)

***

### getExpandedRowModel()

```ts
getExpandedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:120](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L120)

Resolves the row model after expanded rows have been flattened into view.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Table_RowModels.getExpandedRowModel
```

***

### getFacetedMinMaxValues()

```ts
getFacetedMinMaxValues: () => [number, number] | undefined;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:35](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L35)

Computes min/max numeric facet values for the active faceting context.

Requires a `facetedMinMaxValues` row-model factory on the `features` option.

#### Returns

\[`number`, `number`\] \| `undefined`

#### Inherited from

```ts
Table_RowModels.getFacetedMinMaxValues
```

***

### getFacetedRowModel()

```ts
getFacetedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L41)

Computes the row model used to derive facet values.

Requires a `facetedRowModel` row-model factory on the `features` option.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Table_RowModels.getFacetedRowModel
```

***

### getFacetedUniqueValues()

```ts
getFacetedUniqueValues: () => Map<any, number>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:47](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L47)

Computes unique facet values and occurrence counts.

Requires a `facetedUniqueValues` row-model factory on the `features` option.

#### Returns

`Map`\<`any`, `number`\>

#### Inherited from

```ts
Table_RowModels.getFacetedUniqueValues
```

***

### getFilteredRowModel()

```ts
getFilteredRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:296](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L296)

Resolves the row model after column and global filters have been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Table_RowModels.getFilteredRowModel
```

***

### getFlatHeaders()

```ts
getFlatHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [core/headers/coreHeadersFeature.types.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L25)

Flattens every header from every header group, including parent and
placeholder headers.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Inherited from

[`Table_Headers`](Table_Headers.md).[`getFlatHeaders`](Table_Headers.md#getflatheaders)

***

### getFooterGroups()

```ts
getFooterGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [core/headers/coreHeadersFeature.types.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L20)

Builds footer groups by reversing the current header group order.

#### Returns

[`HeaderGroup`](HeaderGroup.md)\<`TFeatures`, `TData`\>[]

#### Inherited from

[`Table_Headers`](Table_Headers.md).[`getFooterGroups`](Table_Headers.md#getfootergroups)

***

### getGroupedRowModel()

```ts
getGroupedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:140](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L140)

Resolves the row model after grouping has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Table_RowModels.getGroupedRowModel
```

***

### getHeaderGroups()

```ts
getHeaderGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [core/headers/coreHeadersFeature.types.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L16)

Builds the visible header groups for the current column tree, visibility,
and pinning state.

#### Returns

[`HeaderGroup`](HeaderGroup.md)\<`TFeatures`, `TData`\>[]

#### Inherited from

[`Table_Headers`](Table_Headers.md).[`getHeaderGroups`](Table_Headers.md#getheadergroups)

***

### getLeafHeaders()

```ts
getLeafHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [core/headers/coreHeadersFeature.types.ts:29](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L29)

Collects only leaf headers, excluding parent/group headers.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Inherited from

[`Table_Headers`](Table_Headers.md).[`getLeafHeaders`](Table_Headers.md#getleafheaders)

***

### getMaxSubRowDepth()

```ts
getMaxSubRowDepth: () => number;
```

Defined in: [core/rows/coreRowsFeature.types.ts:138](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L138)

Returns the deepest structural row depth in the core row model.
Root rows are depth `0`, direct sub-rows are depth `1`, and so on.

#### Returns

`number`

#### Inherited from

[`Table_Rows`](Table_Rows.md).[`getMaxSubRowDepth`](Table_Rows.md#getmaxsubrowdepth)

***

### getPaginatedRowModel()

```ts
getPaginatedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:125](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L125)

Resolves the row model after pagination has sliced the current page.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Table_RowModels.getPaginatedRowModel
```

***

### getPreExpandedRowModel()

```ts
getPreExpandedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:124](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L124)

Reads the row model immediately before expansion.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Table_RowModels.getPreExpandedRowModel
```

***

### getPreFilteredRowModel()

```ts
getPreFilteredRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:300](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L300)

Reads the row model immediately before filtering.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Table_RowModels.getPreFilteredRowModel
```

***

### getPreGroupedRowModel()

```ts
getPreGroupedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:144](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L144)

Reads the row model immediately before grouping.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Table_RowModels.getPreGroupedRowModel
```

***

### getPrePaginatedRowModel()

```ts
getPrePaginatedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:129](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L129)

Reads the row model immediately before pagination.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Table_RowModels.getPrePaginatedRowModel
```

***

### getPreSortedRowModel()

```ts
getPreSortedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:276](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L276)

Reads the row model immediately before sorting.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Table_RowModels.getPreSortedRowModel
```

***

### getRow()

```ts
getRow: (id, searchAll?) => Row<TFeatures, TData>;
```

Defined in: [core/rows/coreRowsFeature.types.ts:153](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L153)

Returns the row with the given ID.

#### Parameters

##### id

`string`

##### searchAll?

`boolean`

#### Returns

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

#### Inherited from

[`Table_Rows`](Table_Rows.md).[`getRow`](Table_Rows.md#getrow)

***

### getRowId()

```ts
getRowId: (_, index, parent?) => string;
```

Defined in: [core/rows/coreRowsFeature.types.ts:149](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L149)

Returns the row id for a given row.

#### Parameters

##### \_

`TData`

##### index

`number`

##### parent?

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

#### Returns

`string`

#### Inherited from

[`Table_Rows`](Table_Rows.md).[`getRowId`](Table_Rows.md#getrowid)

***

### getRowModel()

```ts
getRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [core/row-models/coreRowModelsFeature.types.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts#L38)

Returns the final model after all processing from other used features has been applied. This is the row model that is most commonly used for rendering.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Table_RowModels.getRowModel
```

***

### getRowsInDisplayOrder()

```ts
getRowsInDisplayOrder: () => Row<TFeatures, TData>[];
```

Defined in: [core/rows/coreRowsFeature.types.ts:145](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L145)

Returns the rows in the current display order and assigns their display
indexes. When expanded rows bypass pagination, expanded descendants are
included in this order. This is the memoized source for
`row.getDisplayIndex()`.

#### Returns

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

#### Inherited from

[`Table_Rows`](Table_Rows.md).[`getRowsInDisplayOrder`](Table_Rows.md#getrowsindisplayorder)

***

### getSortedRowModel()

```ts
getSortedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:280](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L280)

Resolves the row model after sorting has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Table_RowModels.getSortedRowModel
```

***

### initialState

```ts
readonly initialState: ExtractFeatureMapTypes<TFeatures>;
```

Defined in: [core/table/coreTablesFeature.types.ts:271](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L271)

This is the resolved initial state of the table.

#### Inherited from

[`Table_Table`](Table_Table.md).[`initialState`](Table_Table.md#initialstate)

***

### optionAtoms

```ts
readonly optionAtoms: TableOptionAtoms<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:283](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L283)

Stable atoms for individual resolved option values.

Ordinary options are writable. Construction-static options are readonly.

#### Inherited from

[`Table_Table`](Table_Table.md).[`optionAtoms`](Table_Table.md#optionatoms)

***

### options

```ts
readonly options: TableOptionsLive<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:277](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L277)

A stable live view of the table's current resolved options.

Reading a property reads the matching entry in `optionAtoms`.

#### Inherited from

[`Table_Table`](Table_Table.md).[`options`](Table_Table.md#options)

***

### reset()

```ts
reset: () => void;
```

Defined in: [core/table/coreTablesFeature.types.ts:303](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L303)

Resets the table's internal base atoms to `table.initialState`.

Prefer feature-specific reset APIs, such as `resetPagination`, when a state
slice may be owned by an external atom or needs that feature's blank/default
reset behavior. After resetting internal atoms, this also invokes feature
reset hooks for mutable, transient table-instance data.

#### Returns

`void`

#### Inherited from

[`Table_Table`](Table_Table.md).[`reset`](Table_Table.md#reset)

***

### setOptions()

```ts
setOptions: (newOptions) => void;
```

Defined in: [core/table/coreTablesFeature.types.ts:308](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L308)

Updates the table options by applying a value or updater to the current
resolved options and then merging them through `options.mergeOptions`.

#### Parameters

##### newOptions

[`Updater`](../type-aliases/Updater.md)\<[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>\>

#### Returns

`void`

#### Inherited from

[`Table_Table`](Table_Table.md).[`setOptions`](Table_Table.md#setoptions)

***

### store

```ts
readonly store: ReadonlyStore<ExtractFeatureMapTypes<TFeatures, TableState_FeatureMap>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:288](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L288)

The readonly flat store for the table state. Derives from `table.atoms`
only; never reads external state directly.

#### Inherited from

[`Table_Table`](Table_Table.md).[`store`](Table_Table.md#store)

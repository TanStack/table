---
id: Table_Internal
title: Table_Internal
---

# Interface: Table\_Internal\<TFeatures, TData\>

Defined in: [types/Table.ts:94](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Table.ts#L94)

Internal broad table shape used by feature implementations.

## Extends

- `Omit`\<[`Table_Table`](Table_Table.md)\<`TFeatures`, `TData`\>, `Table_InternalBroadenedKeys`\>.[`Table_Columns`](Table_Columns.md)\<`TFeatures`, `TData`\>.[`Table_Rows`](Table_Rows.md)\<`TFeatures`, `TData`\>.[`Table_RowModels`](../type-aliases/Table_RowModels.md)\<`TFeatures`, `TData`\>.[`Table_Headers`](Table_Headers.md)\<`TFeatures`, `TData`\>

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

## Properties

### \_cellPrototype?

```ts
optional _cellPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:165](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L165)

Prototype cache for Cell objects - shared by all cells in this table

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_cellPrototype`](Table_CoreProperties.md#_cellprototype)

***

### \_columnPrototype?

```ts
optional _columnPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:169](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L169)

Prototype cache for Column objects - shared by all columns in this table

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_columnPrototype`](Table_CoreProperties.md#_columnprototype)

***

### \_features

```ts
readonly _features: Partial<CoreFeatures> & TFeatures;
```

Defined in: [core/table/coreTablesFeature.types.ts:173](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L173)

The features that are enabled for the table.

#### Inherited from

```ts
Omit._features
```

***

### \_headerPrototype?

```ts
optional _headerPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:177](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L177)

Prototype cache for Header objects - shared by all headers in this table

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_headerPrototype`](Table_CoreProperties.md#_headerprototype)

***

### \_reactivity

```ts
readonly _reactivity: TableReactivityBindings;
```

Defined in: [core/table/coreTablesFeature.types.ts:161](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L161)

Table reactivity bindings for interacting with TanStack Store.

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_reactivity`](Table_CoreProperties.md#_reactivity)

***

### \_rowModelFns

```ts
_rowModelFns: RowModelFns_All<TFeatures, TData>;
```

Defined in: [types/Table.ts:105](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Table.ts#L105)

***

### \_rowModels

```ts
_rowModels: CachedRowModel_All<TFeatures, TData>;
```

Defined in: [types/Table.ts:104](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Table.ts#L104)

***

### \_rowPrototype?

```ts
optional _rowPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:189](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L189)

Prototype cache for Row objects - shared by all rows in this table

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_rowPrototype`](Table_CoreProperties.md#_rowprototype)

***

### atoms

```ts
atoms: Atoms<TFeatures> & Atoms_All;
```

Defined in: [types/Table.ts:114](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Table.ts#L114)

The readonly derived atoms for each `TableState` slice. Each derives from
its corresponding `baseAtom` plus, optionally, a per-slice external atom or
external state value (precedence: external atom > external state > base atom).

#### Overrides

```ts
Omit.atoms
```

***

### baseAtoms

```ts
baseAtoms: BaseAtoms<TFeatures> & BaseAtoms_All;
```

Defined in: [types/Table.ts:113](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Table.ts#L113)

The internal writable atoms for each `TableState` slice. This is the library's
single write surface — all state mutations from features land here.

#### Overrides

```ts
Omit.baseAtoms
```

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

Defined in: [core/row-models/coreRowModelsFeature.types.ts:35](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts#L35)

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

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:121](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L121)

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

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:36](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L36)

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

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:42](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L42)

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

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:48](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L48)

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

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:236](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L236)

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

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:222](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L222)

Resolves the row model after grouping and aggregation have been applied.

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

### getPaginatedRowModel()

```ts
getPaginatedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:126](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L126)

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

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:125](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L125)

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

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:240](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L240)

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

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:226](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L226)

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

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:130](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L130)

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

Defined in: [features/row-sorting/rowSortingFeature.types.ts:224](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L224)

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

Defined in: [core/rows/coreRowsFeature.types.ts:116](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L116)

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

Defined in: [core/rows/coreRowsFeature.types.ts:112](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L112)

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

Defined in: [core/row-models/coreRowModelsFeature.types.ts:39](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts#L39)

Returns the final model after all processing from other used features has been applied. This is the row model that is most commonly used for rendering.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Inherited from

```ts
Table_RowModels.getRowModel
```

***

### getSortedRowModel()

```ts
getSortedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:228](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L228)

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
initialState: ExtractFeatureMapTypes<TFeatures, TableState_FeatureMap> & TableState_All;
```

Defined in: [types/Table.ts:112](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Table.ts#L112)

***

### options

```ts
options: object & DebugKeysFor<CoreFeatures & TableFeatures> & TableOptions_Core<TFeatures, TData> & Partial<TableOptions_ColumnFiltering<TFeatures, TData> & TableOptions_ColumnGrouping & TableOptions_ColumnOrdering & TableOptions_ColumnPinning & TableOptions_ColumnResizing & TableOptions_ColumnSizing & TableOptions_ColumnVisibility & TableOptions_GlobalFiltering<TFeatures, TData> & TableOptions_RowExpanding<TFeatures, TData> & TableOptions_RowPagination & TableOptions_RowPinning<TFeatures, TData> & TableOptions_RowSelection<TFeatures, TData> & TableOptions_RowSorting> & object;
```

Defined in: [types/Table.ts:106](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Table.ts#L106)

#### Type Declaration

##### debugAll?

```ts
optional debugAll: boolean;
```

##### debugCache?

```ts
optional debugCache: boolean;
```

##### debugCells?

```ts
optional debugCells: boolean;
```

##### debugColumns?

```ts
optional debugColumns: boolean;
```

##### debugHeaders?

```ts
optional debugHeaders: boolean;
```

##### debugRows?

```ts
optional debugRows: boolean;
```

##### debugTable?

```ts
optional debugTable: boolean;
```

#### Type Declaration

##### atoms?

```ts
optional atoms: Partial<{
  columnFilters?: Atom<
     | ColumnFiltersState
    | undefined>;
  columnOrder?: Atom<ColumnOrderState | undefined>;
  columnPinning?: Atom<ColumnPinningState | undefined>;
  columnResizing?: Atom<columnResizingState | undefined>;
  columnSizing?: Atom<ColumnSizingState | undefined>;
  columnVisibility?: Atom<
     | ColumnVisibilityState
    | undefined>;
  expanded?: Atom<ExpandedState | undefined>;
  globalFilter?: Atom<any>;
  grouping?: Atom<GroupingState | undefined>;
  pagination?: Atom<PaginationState | undefined>;
  rowPinning?: Atom<RowPinningState | undefined>;
  rowSelection?: Atom<RowSelectionState | undefined>;
  sorting?: Atom<SortingState | undefined>;
}>;
```

##### initialState?

```ts
optional initialState: TableState_All;
```

##### state?

```ts
optional state: TableState_All;
```

***

### optionsStore?

```ts
readonly optional optionsStore: Atom<TableOptions<TFeatures, TData>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:214](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L214)

Writable atom for table options. Only created when `createOptionsStore` is
true on the active core reactivity bindings. Adapters that opt out keep
options as plain resolved data instead of backing them with an atom.

#### Inherited from

```ts
Omit.optionsStore
```

***

### reset()

```ts
reset: () => void;
```

Defined in: [core/table/coreTablesFeature.types.ts:233](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L233)

Resets the table's internal base atoms to `table.initialState`.

Prefer feature-specific reset APIs, such as `resetPagination`, when a state
slice may be owned by an external atom or needs that feature's blank/default
reset behavior.

#### Returns

`void`

#### Inherited from

```ts
Omit.reset
```

***

### setOptions()

```ts
setOptions: (newOptions) => void;
```

Defined in: [core/table/coreTablesFeature.types.ts:238](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L238)

Updates the table options by applying a value or updater to the current
resolved options and then merging them through `options.mergeOptions`.

#### Parameters

##### newOptions

[`Updater`](../type-aliases/Updater.md)\<[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>\>

#### Returns

`void`

#### Inherited from

```ts
Omit.setOptions
```

***

### store

```ts
store: ReadonlyStore<ExtractFeatureMapTypes<TFeatures, TableState_FeatureMap>> & ReadonlyStore<TableState_All>;
```

Defined in: [types/Table.ts:115](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Table.ts#L115)

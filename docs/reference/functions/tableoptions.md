---
id: tableOptions
title: tableOptions
---

# Function: tableOptions()

## tableOptions(options)

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "columns" | "_features"> & object
```

### Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown` = `any`

### Parameters

• **options**: `Omit`\<`object`, `"columns"`\> & `object`

### Returns

`Omit`\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>, `"columns"` \| `"_features"`\> & `object`

### Defined in

[helpers/tableOptions.ts:5](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/helpers/tableOptions.ts#L5)

## tableOptions(options)

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "data" | "_features"> & object
```

### Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown` = `any`

### Parameters

• **options**: `Omit`\<`object`, `"data"`\> & `object`

### Returns

`Omit`\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>, `"data"` \| `"_features"`\> & `object`

### Defined in

[helpers/tableOptions.ts:16](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/helpers/tableOptions.ts#L16)

## tableOptions(options)

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "_features">
```

### Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown` = `any`

### Parameters

• **options**: `Omit`\<`object`, `"_features"`\>

### Returns

`Omit`\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>, `"_features"`\>

### Defined in

[helpers/tableOptions.ts:27](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/helpers/tableOptions.ts#L27)

## tableOptions(options)

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "data" | "columns" | "_features"> & object
```

### Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown` = `any`

### Parameters

• **options**: `Omit`\<`object`, `"data"` \| `"columns"`\> & `object`

### Returns

`Omit`\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>, `"data"` \| `"columns"` \| `"_features"`\> & `object`

### Defined in

[helpers/tableOptions.ts:34](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/helpers/tableOptions.ts#L34)

## tableOptions(options)

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "data" | "_features">
```

### Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown` = `any`

### Parameters

• **options**: `Omit`\<`object`, `"_features"` \| `"data"`\>

### Returns

`Omit`\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>, `"data"` \| `"_features"`\>

### Defined in

[helpers/tableOptions.ts:45](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/helpers/tableOptions.ts#L45)

## tableOptions(options)

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "columns" | "_features">
```

### Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown` = `any`

### Parameters

• **options**: `Omit`\<`object`, `"_features"` \| `"columns"`\>

### Returns

`Omit`\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>, `"columns"` \| `"_features"`\>

### Defined in

[helpers/tableOptions.ts:52](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/helpers/tableOptions.ts#L52)

## tableOptions(options)

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "data" | "columns" | "_features">
```

### Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown` = `any`

### Parameters

• **options**: `Omit`\<`object`, `"_features"` \| `"data"` \| `"columns"`\>

### Returns

`Omit`\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>, `"data"` \| `"columns"` \| `"_features"`\>

### Defined in

[helpers/tableOptions.ts:59](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/helpers/tableOptions.ts#L59)

## tableOptions(options)

```ts
function tableOptions<TFeatures, TData>(options): TableOptions<TFeatures, TData>
```

### Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown` = `any`

### Parameters

• **options**

• **options.\_features**: [`TableFeatures`](../interfaces/tablefeatures.md)

The features that you want to enable for the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#_features)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **options.\_rowModels?**: `RowModelOptions`\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\>

The row model options that you want to enable for the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#_rowmodels)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **options.aggregationFns?**: `Record`\<`string`, [`AggregationFn`](../type-aliases/aggregationfn.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\>\>

• **options.autoResetAll?**: `boolean`

Set this option to override any of the `autoReset...` feature options.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#autoresetall)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **options.autoResetExpanded?**: `boolean`

Enable this setting to automatically reset the expanded state of the table when expanding state changes.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#autoresetexpanded)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

• **options.autoResetPageIndex?**: `boolean`

If set to `true`, pagination will be reset to the first page when page-altering state changes eg. `data` is updated, filters change, grouping changes, etc.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#autoresetpageindex)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

• **options.columnResizeDirection?**: [`ColumnResizeDirection`](../type-aliases/columnresizedirection.md)

Enables or disables right-to-left support for resizing the column. defaults to 'ltr'.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#columnResizeDirection)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

• **options.columnResizeMode?**: [`ColumnResizeMode`](../type-aliases/columnresizemode.md)

Determines when the columnSizing state is updated. `onChange` updates the state when the user is dragging the resize handle. `onEnd` updates the state when the user releases the resize handle.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#columnresizemode)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

• **options.columns**: [`ColumnDef`](../type-aliases/columndef.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`, `unknown`\>[]

The array of column defs to use for the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#columns)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **options.data**: `TData`[]

The data for the table to display. This array should match the type you provided to `table.setRowType<...>`. Columns can access this data via string/index or a functional accessor. When the `data` option changes reference, the table will reprocess the data.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#data)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **options.debugAll?**: `boolean`

Set this option to `true` to output all debugging information to the console.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugall)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **options.debugCells?**: `boolean`

Set this option to `true` to output cell debugging information to the console.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugcells]

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **options.debugColumns?**: `boolean`

Set this option to `true` to output column debugging information to the console.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugcolumns)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **options.debugHeaders?**: `boolean`

Set this option to `true` to output header debugging information to the console.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugheaders)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **options.debugRows?**: `boolean`

Set this option to `true` to output row debugging information to the console.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugrows)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **options.debugTable?**: `boolean`

Set this option to `true` to output table debugging information to the console.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugtable)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **options.defaultColumn?**: `Partial`\<[`ColumnDef`](../type-aliases/columndef.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`, `unknown`\>\>

Default column options to use for all column defs supplied to the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#defaultcolumn)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **options.enableColumnFilters?**: `boolean`

Enables/disables **column** filtering for all columns.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#enablecolumnfilters)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

• **options.enableColumnPinning?**: `boolean`

Enables/disables column pinning for the table. Defaults to `true`.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#enablecolumnpinning)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)

• **options.enableColumnResizing?**: `boolean`

Enables or disables column resizing for the column.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#enablecolumnresizing)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

• **options.enableExpanding?**: `boolean`

Enable/disable expanding for all rows.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#enableexpanding)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

• **options.enableFilters?**: `boolean`

Enables/disables all filtering for the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#enablefilters)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

• **options.enableGlobalFilter?**: `boolean`

Enables/disables **global** filtering for all columns.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#enableglobalfilter)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)

• **options.enableGrouping?**: `boolean`

Enables/disables grouping for the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#enablegrouping)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

• **options.enableHiding?**: `boolean`

Whether to enable column hiding. Defaults to `true`.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#enablehiding)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

• **options.enableMultiRemove?**: `boolean`

Enables/disables the ability to remove multi-sorts

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablemultiremove)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

• **options.enableMultiRowSelection?**: `boolean` \| (`row`) => `boolean`

- Enables/disables multiple row selection for all rows in the table OR
- A function that given a row, returns whether to enable/disable multiple row selection for that row's children/grandchildren

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#enablemultirowselection)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

• **options.enableMultiSort?**: `boolean`

Enables/Disables multi-sorting for the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablemultisort)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

• **options.enablePinning?**: `boolean`

**Deprecated**

Use `enableColumnPinning` or `enableRowPinning` instead.
Enables/disables all pinning for the table. Defaults to `true`.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#enablepinning)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)

• **options.enableRowPinning?**: `boolean` \| (`row`) => `boolean`

Enables/disables row pinning for the table. Defaults to `true`.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#enablerowpinning)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)

• **options.enableRowSelection?**: `boolean` \| (`row`) => `boolean`

- Enables/disables row selection for all rows in the table OR
- A function that given a row, returns whether to enable/disable row selection for that row

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#enablerowselection)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

• **options.enableSorting?**: `boolean`

Enables/Disables sorting for the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablesorting)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

• **options.enableSortingRemoval?**: `boolean`

Enables/Disables the ability to remove sorting for the table.
- If `true` then changing sort order will circle like: 'none' -> 'desc' -> 'asc' -> 'none' -> ...
- If `false` then changing sort order will circle like: 'none' -> 'desc' -> 'asc' -> 'desc' -> 'asc' -> ...

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablesortingremoval)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

• **options.enableSubRowSelection?**: `boolean` \| (`row`) => `boolean`

Enables/disables automatic sub-row selection when a parent row is selected, or a function that enables/disables automatic sub-row selection for each row.
(Use in combination with expanding or grouping features)

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#enablesubrowselection)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

• **options.filterFns?**: `Record`\<`string`, [`FilterFn`](../interfaces/filterfn.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\>\>

• **options.filterFromLeafRows?**: `boolean`

By default, filtering is done from parent rows down (so if a parent row is filtered out, all of its children will be filtered out as well). Setting this option to `true` will cause filtering to be done from leaf rows up (which means parent rows will be included so long as one of their child or grand-child rows is also included).

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#filterfromleafrows)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

• **options.getColumnCanGlobalFilter?**

If provided, this function will be called with the column and should return `true` or `false` to indicate whether this column should be used for global filtering.

This is useful if the column can contain data that is not `string` or `number` (i.e. `undefined`).

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#getcolumncanglobalfilter)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)

• **options.getIsRowExpanded?**

If provided, allows you to override the default behavior of determining whether a row is currently expanded.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getisrowexpanded)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

• **options.getRowCanExpand?**

If provided, allows you to override the default behavior of determining whether a row can be expanded.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getrowcanexpand)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

• **options.getRowId?**

This optional function is used to derive a unique ID for any given row. If not provided the rows index is used (nested rows join together with `.` using their grandparents' index eg. `index.index.index`). If you need to identify individual rows that are originating from any server-side operations, it's suggested you use this function to return an ID that makes sense regardless of network IO/ambiguity eg. a userId, taskId, database ID field, etc.

**Example**

```ts
getRowId: row => row.userId
```

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#getrowid)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **options.getSubRows?**

This optional function is used to access the sub rows for any given row. If you are using nested rows, you will need to use this function to return the sub rows object (or undefined) from the row.

**Example**

```ts
getSubRows: row => row.subRows
```

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#getsubrows)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **options.globalFilterFn?**: [`FilterFnOption`](../type-aliases/filterfnoption.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\>

The filter function to use for global filtering.
- A `string` referencing a built-in filter function
- A `string` that references a custom filter functions provided via the `tableOptions.filterFns` option
- A custom filter function

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#globalfilterfn)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)

• **options.groupedColumnMode?**: `false` \| `"reorder"` \| `"remove"`

Grouping columns are automatically reordered by default to the start of the columns list. If you would rather remove them or leave them as-is, set the appropriate mode here.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#groupedcolumnmode)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

• **options.initialState?**: `Partial`\<`object`\>

Use this option to optionally pass initial state to the table. This state will be used when resetting various table states either automatically by the table (eg. `options.autoResetPageIndex`) or via functions like `table.resetRowSelection()`. Most reset function allow you optionally pass a flag to reset to a blank/default state instead of the initial state.

Table state will not be reset when this object changes, which also means that the initial state object does not need to be stable.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#initialstate)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **options.isMultiSortEvent?**

Pass a custom function that will be used to determine if a multi-sort event should be triggered. It is passed the event from the sort toggle handler and should return `true` if the event should trigger a multi-sort.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#ismultisortevent)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

• **options.keepPinnedRows?**: `boolean`

When `false`, pinned rows will not be visible if they are filtered or paginated out of the table. When `true`, pinned rows will always be visible regardless of filtering or pagination. Defaults to `true`.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#keeppinnedrows)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)

• **options.manualExpanding?**: `boolean`

Enables manual row expansion. If this is set to `true`, `getExpandedRowModel` will not be used to expand rows and you would be expected to perform the expansion in your own data model. This is useful if you are doing server-side expansion.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#manualexpanding)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

• **options.manualFiltering?**: `boolean`

Disables the `getFilteredRowModel` from being used to filter data. This may be useful if your table needs to dynamically support both client-side and server-side filtering.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#manualfiltering)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

• **options.manualGrouping?**: `boolean`

Enables manual grouping. If this option is set to `true`, the table will not automatically group rows using `getGroupedRowModel()` and instead will expect you to manually group the rows before passing them to the table. This is useful if you are doing server-side grouping and aggregation.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#manualgrouping)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

• **options.manualPagination?**: `boolean`

Enables manual pagination. If this option is set to `true`, the table will not automatically paginate rows using `getPaginatedRowModel()` and instead will expect you to manually paginate the rows before passing them to the table. This is useful if you are doing server-side pagination and aggregation.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#manualpagination)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

• **options.manualSorting?**: `boolean`

Enables manual sorting for the table. If this is `true`, you will be expected to sort your data before it is passed to the table. This is useful if you are doing server-side sorting.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#manualsorting)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

• **options.maxLeafRowFilterDepth?**: `number`

By default, filtering is done for all rows (max depth of 100), no matter if they are root level parent rows or the child leaf rows of a parent row. Setting this option to `0` will cause filtering to only be applied to the root level parent rows, with all sub-rows remaining unfiltered. Similarly, setting this option to `1` will cause filtering to only be applied to child leaf rows 1 level deep, and so on.

This is useful for situations where you want a row's entire child hierarchy to be visible regardless of the applied filter.
 *

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#maxleafrowfilterdepth)
 *

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

• **options.maxMultiSortColCount?**: `number`

Set a maximum number of columns that can be multi-sorted.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#maxmultisortcolcount)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

• **options.mergeOptions?**

This option is used to optionally implement the merging of table options.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#mergeoptions)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **options.meta?**: [`TableMeta`](../interfaces/tablemeta.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\>

You can pass any object to `options.meta` and access it anywhere the `table` is available via `table.options.meta`.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#meta)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **options.onColumnFiltersChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`ColumnFiltersState`](../type-aliases/columnfiltersstate.md)\>

If provided, this function will be called with an `updaterFn` when `state.columnFilters` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#oncolumnfilterschange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

• **options.onColumnOrderChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`ColumnOrderState`](../type-aliases/columnorderstate.md)\>

If provided, this function will be called with an `updaterFn` when `state.columnOrder` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-ordering#oncolumnorderchange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-ordering)

• **options.onColumnPinningChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`ColumnPinningState`](../interfaces/columnpinningstate.md)\>

If provided, this function will be called with an `updaterFn` when `state.columnPinning` changes. This overrides the default internal state management, so you will also need to supply `state.columnPinning` from your own managed state.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#oncolumnpinningchange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/oncolumnpinningchange)

• **options.onColumnSizingChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`ColumnSizingState`](../type-aliases/columnsizingstate.md)\>

If provided, this function will be called with an `updaterFn` when `state.columnSizing` changes. This overrides the default internal state management, so you will also need to supply `state.columnSizing` from your own managed state.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#oncolumnsizingchange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

• **options.onColumnSizingInfoChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`ColumnResizingInfoState`](../interfaces/columnresizinginfostate.md)\>

If provided, this function will be called with an `updaterFn` when `state.columnSizingInfo` changes. This overrides the default internal state management, so you will also need to supply `state.columnSizingInfo` from your own managed state.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#oncolumnsizinginfochange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

• **options.onColumnVisibilityChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`ColumnVisibilityState`](../type-aliases/columnvisibilitystate.md)\>

If provided, this function will be called with an `updaterFn` when `state.columnVisibility` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#oncolumnvisibilitychange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

• **options.onExpandedChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`ExpandedState`](../type-aliases/expandedstate.md)\>

This function is called when the `expanded` table state changes. If a function is provided, you will be responsible for managing this state on your own. To pass the managed state back to the table, use the `tableOptions.state.expanded` option.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#onexpandedchange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

• **options.onGlobalFilterChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<`any`\>

If provided, this function will be called with an `updaterFn` when `state.globalFilter` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#onglobalfilterchange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)

• **options.onGroupingChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`GroupingState`](../type-aliases/groupingstate.md)\>

If this function is provided, it will be called when the grouping state changes and you will be expected to manage the state yourself. You can pass the managed state back to the table via the `tableOptions.state.grouping` option.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#ongroupingchange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

• **options.onPaginationChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`PaginationState`](../interfaces/paginationstate.md)\>

If this function is provided, it will be called when the pagination state changes and you will be expected to manage the state yourself. You can pass the managed state back to the table via the `tableOptions.state.pagination` option.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#onpaginationchange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

• **options.onRowPinningChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`RowPinningState`](../interfaces/rowpinningstate.md)\>

If provided, this function will be called with an `updaterFn` when `state.rowPinning` changes. This overrides the default internal state management, so you will also need to supply `state.rowPinning` from your own managed state.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#onrowpinningchange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/onrowpinningchange)

• **options.onRowSelectionChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`RowSelectionState`](../type-aliases/rowselectionstate.md)\>

If provided, this function will be called with an `updaterFn` when `state.rowSelection` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#onrowselectionchange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

• **options.onSortingChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`SortingState`](../type-aliases/sortingstate.md)\>

If provided, this function will be called with an `updaterFn` when `state.sorting` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#onsortingchange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

• **options.onStateChange?**

The `onStateChange` option can be used to optionally listen to state changes within the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#onstatechange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **options.pageCount?**: `number`

When manually controlling pagination, you can supply a total `pageCount` value to the table if you know it (Or supply a `rowCount` and `pageCount` will be calculated). If you do not know how many pages there are, you can set this to `-1`.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#pagecount)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

• **options.paginateExpandedRows?**: `boolean`

If `true` expanded rows will be paginated along with the rest of the table (which means expanded rows may span multiple pages). If `false` expanded rows will not be considered for pagination (which means expanded rows will always render on their parents page. This also means more rows will be rendered than the set page size)

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#paginateexpandedrows)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

• **options.renderFallbackValue?**: `any`

Value used when the desired value is not found in the data.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#renderfallbackvalue)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **options.rowCount?**: `number`

When manually controlling pagination, you can supply a total `rowCount` value to the table if you know it. The `pageCount` can be calculated from this value and the `pageSize`.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#rowcount)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

• **options.sortDescFirst?**: `boolean`

If `true`, all sorts will default to descending as their first toggle state.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#sortdescfirst)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

• **options.sortingFns?**: `Record`\<`string`, [`SortingFn`](../interfaces/sortingfn.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\>\>

• **options.state?**: `Partial`\<`object`\>

The `state` option can be used to optionally _control_ part or all of the table state. The state you pass here will merge with and overwrite the internal automatically-managed state to produce the final state for the table. You can also listen to state changes via the `onStateChange` option.
> Note: Any state passed in here will override both the internal state and any other `initialState` you provide.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#state)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

### Returns

[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>

### Defined in

[helpers/tableOptions.ts:69](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/helpers/tableOptions.ts#L69)

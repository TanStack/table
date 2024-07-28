---
id: table_mergeOptions
title: table_mergeOptions
---

# Function: table\_mergeOptions()

```ts
function table_mergeOptions<TFeatures, TData>(table, newOptions): object
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **newOptions**

• **newOptions.\_features**: [`TableFeatures`](../interfaces/tablefeatures.md)

The features that you want to enable for the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#_features)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **newOptions.\_rowModels?**: `RowModelOptions`\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\>

The row model options that you want to enable for the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#_rowmodels)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **newOptions.aggregationFns?**: `Record`\<`string`, [`AggregationFn`](../type-aliases/aggregationfn.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\>\>

• **newOptions.autoResetAll?**: `boolean`

Set this option to override any of the `autoReset...` feature options.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#autoresetall)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **newOptions.autoResetExpanded?**: `boolean`

Enable this setting to automatically reset the expanded state of the table when expanding state changes.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#autoresetexpanded)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

• **newOptions.autoResetPageIndex?**: `boolean`

If set to `true`, pagination will be reset to the first page when page-altering state changes eg. `data` is updated, filters change, grouping changes, etc.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#autoresetpageindex)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

• **newOptions.columnResizeDirection?**: [`ColumnResizeDirection`](../type-aliases/columnresizedirection.md)

Enables or disables right-to-left support for resizing the column. defaults to 'ltr'.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#columnResizeDirection)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

• **newOptions.columnResizeMode?**: [`ColumnResizeMode`](../type-aliases/columnresizemode.md)

Determines when the columnSizing state is updated. `onChange` updates the state when the user is dragging the resize handle. `onEnd` updates the state when the user releases the resize handle.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#columnresizemode)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

• **newOptions.columns**: [`ColumnDef`](../type-aliases/columndef.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`, `unknown`\>[]

The array of column defs to use for the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#columns)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **newOptions.data**: `TData`[]

The data for the table to display. This array should match the type you provided to `table.setRowType<...>`. Columns can access this data via string/index or a functional accessor. When the `data` option changes reference, the table will reprocess the data.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#data)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **newOptions.debugAll?**: `boolean`

Set this option to `true` to output all debugging information to the console.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugall)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **newOptions.debugCells?**: `boolean`

Set this option to `true` to output cell debugging information to the console.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugcells]

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **newOptions.debugColumns?**: `boolean`

Set this option to `true` to output column debugging information to the console.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugcolumns)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **newOptions.debugHeaders?**: `boolean`

Set this option to `true` to output header debugging information to the console.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugheaders)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **newOptions.debugRows?**: `boolean`

Set this option to `true` to output row debugging information to the console.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugrows)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **newOptions.debugTable?**: `boolean`

Set this option to `true` to output table debugging information to the console.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugtable)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **newOptions.defaultColumn?**: `Partial`\<[`ColumnDef`](../type-aliases/columndef.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`, `unknown`\>\>

Default column options to use for all column defs supplied to the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#defaultcolumn)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **newOptions.enableColumnFilters?**: `boolean`

Enables/disables **column** filtering for all columns.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#enablecolumnfilters)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

• **newOptions.enableColumnPinning?**: `boolean`

Enables/disables column pinning for the table. Defaults to `true`.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#enablecolumnpinning)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)

• **newOptions.enableColumnResizing?**: `boolean`

Enables or disables column resizing for the column.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#enablecolumnresizing)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

• **newOptions.enableExpanding?**: `boolean`

Enable/disable expanding for all rows.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#enableexpanding)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

• **newOptions.enableFilters?**: `boolean`

Enables/disables all filtering for the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#enablefilters)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

• **newOptions.enableGlobalFilter?**: `boolean`

Enables/disables **global** filtering for all columns.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#enableglobalfilter)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)

• **newOptions.enableGrouping?**: `boolean`

Enables/disables grouping for the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#enablegrouping)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

• **newOptions.enableHiding?**: `boolean`

Whether to enable column hiding. Defaults to `true`.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#enablehiding)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

• **newOptions.enableMultiRemove?**: `boolean`

Enables/disables the ability to remove multi-sorts

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablemultiremove)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

• **newOptions.enableMultiRowSelection?**: `boolean` \| (`row`) => `boolean`

- Enables/disables multiple row selection for all rows in the table OR
- A function that given a row, returns whether to enable/disable multiple row selection for that row's children/grandchildren

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#enablemultirowselection)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

• **newOptions.enableMultiSort?**: `boolean`

Enables/Disables multi-sorting for the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablemultisort)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

• **newOptions.enablePinning?**: `boolean`

**Deprecated**

Use `enableColumnPinning` or `enableRowPinning` instead.
Enables/disables all pinning for the table. Defaults to `true`.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#enablepinning)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)

• **newOptions.enableRowPinning?**: `boolean` \| (`row`) => `boolean`

Enables/disables row pinning for the table. Defaults to `true`.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#enablerowpinning)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)

• **newOptions.enableRowSelection?**: `boolean` \| (`row`) => `boolean`

- Enables/disables row selection for all rows in the table OR
- A function that given a row, returns whether to enable/disable row selection for that row

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#enablerowselection)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

• **newOptions.enableSorting?**: `boolean`

Enables/Disables sorting for the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablesorting)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

• **newOptions.enableSortingRemoval?**: `boolean`

Enables/Disables the ability to remove sorting for the table.
- If `true` then changing sort order will circle like: 'none' -> 'desc' -> 'asc' -> 'none' -> ...
- If `false` then changing sort order will circle like: 'none' -> 'desc' -> 'asc' -> 'desc' -> 'asc' -> ...

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablesortingremoval)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

• **newOptions.enableSubRowSelection?**: `boolean` \| (`row`) => `boolean`

Enables/disables automatic sub-row selection when a parent row is selected, or a function that enables/disables automatic sub-row selection for each row.
(Use in combination with expanding or grouping features)

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#enablesubrowselection)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

• **newOptions.filterFns?**: `Record`\<`string`, [`FilterFn`](../interfaces/filterfn.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\>\>

• **newOptions.filterFromLeafRows?**: `boolean`

By default, filtering is done from parent rows down (so if a parent row is filtered out, all of its children will be filtered out as well). Setting this option to `true` will cause filtering to be done from leaf rows up (which means parent rows will be included so long as one of their child or grand-child rows is also included).

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#filterfromleafrows)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

• **newOptions.getColumnCanGlobalFilter?**

If provided, this function will be called with the column and should return `true` or `false` to indicate whether this column should be used for global filtering.

This is useful if the column can contain data that is not `string` or `number` (i.e. `undefined`).

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#getcolumncanglobalfilter)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)

• **newOptions.getIsRowExpanded?**

If provided, allows you to override the default behavior of determining whether a row is currently expanded.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getisrowexpanded)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

• **newOptions.getRowCanExpand?**

If provided, allows you to override the default behavior of determining whether a row can be expanded.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getrowcanexpand)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

• **newOptions.getRowId?**

This optional function is used to derive a unique ID for any given row. If not provided the rows index is used (nested rows join together with `.` using their grandparents' index eg. `index.index.index`). If you need to identify individual rows that are originating from any server-side operations, it's suggested you use this function to return an ID that makes sense regardless of network IO/ambiguity eg. a userId, taskId, database ID field, etc.

**Example**

```ts
getRowId: row => row.userId
```

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#getrowid)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **newOptions.getSubRows?**

This optional function is used to access the sub rows for any given row. If you are using nested rows, you will need to use this function to return the sub rows object (or undefined) from the row.

**Example**

```ts
getSubRows: row => row.subRows
```

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#getsubrows)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **newOptions.globalFilterFn?**: [`FilterFnOption`](../type-aliases/filterfnoption.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\>

The filter function to use for global filtering.
- A `string` referencing a built-in filter function
- A `string` that references a custom filter functions provided via the `tableOptions.filterFns` option
- A custom filter function

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#globalfilterfn)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)

• **newOptions.groupedColumnMode?**: `false` \| `"reorder"` \| `"remove"`

Grouping columns are automatically reordered by default to the start of the columns list. If you would rather remove them or leave them as-is, set the appropriate mode here.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#groupedcolumnmode)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

• **newOptions.initialState?**: `Partial`\<`object`\>

Use this option to optionally pass initial state to the table. This state will be used when resetting various table states either automatically by the table (eg. `options.autoResetPageIndex`) or via functions like `table.resetRowSelection()`. Most reset function allow you optionally pass a flag to reset to a blank/default state instead of the initial state.

Table state will not be reset when this object changes, which also means that the initial state object does not need to be stable.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#initialstate)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **newOptions.isMultiSortEvent?**

Pass a custom function that will be used to determine if a multi-sort event should be triggered. It is passed the event from the sort toggle handler and should return `true` if the event should trigger a multi-sort.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#ismultisortevent)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

• **newOptions.keepPinnedRows?**: `boolean`

When `false`, pinned rows will not be visible if they are filtered or paginated out of the table. When `true`, pinned rows will always be visible regardless of filtering or pagination. Defaults to `true`.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#keeppinnedrows)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)

• **newOptions.manualExpanding?**: `boolean`

Enables manual row expansion. If this is set to `true`, `getExpandedRowModel` will not be used to expand rows and you would be expected to perform the expansion in your own data model. This is useful if you are doing server-side expansion.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#manualexpanding)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

• **newOptions.manualFiltering?**: `boolean`

Disables the `getFilteredRowModel` from being used to filter data. This may be useful if your table needs to dynamically support both client-side and server-side filtering.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#manualfiltering)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

• **newOptions.manualGrouping?**: `boolean`

Enables manual grouping. If this option is set to `true`, the table will not automatically group rows using `getGroupedRowModel()` and instead will expect you to manually group the rows before passing them to the table. This is useful if you are doing server-side grouping and aggregation.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#manualgrouping)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

• **newOptions.manualPagination?**: `boolean`

Enables manual pagination. If this option is set to `true`, the table will not automatically paginate rows using `getPaginatedRowModel()` and instead will expect you to manually paginate the rows before passing them to the table. This is useful if you are doing server-side pagination and aggregation.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#manualpagination)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

• **newOptions.manualSorting?**: `boolean`

Enables manual sorting for the table. If this is `true`, you will be expected to sort your data before it is passed to the table. This is useful if you are doing server-side sorting.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#manualsorting)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

• **newOptions.maxLeafRowFilterDepth?**: `number`

By default, filtering is done for all rows (max depth of 100), no matter if they are root level parent rows or the child leaf rows of a parent row. Setting this option to `0` will cause filtering to only be applied to the root level parent rows, with all sub-rows remaining unfiltered. Similarly, setting this option to `1` will cause filtering to only be applied to child leaf rows 1 level deep, and so on.

This is useful for situations where you want a row's entire child hierarchy to be visible regardless of the applied filter.
 *

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#maxleafrowfilterdepth)
 *

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

• **newOptions.maxMultiSortColCount?**: `number`

Set a maximum number of columns that can be multi-sorted.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#maxmultisortcolcount)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

• **newOptions.mergeOptions?**

This option is used to optionally implement the merging of table options.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#mergeoptions)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **newOptions.meta?**: [`TableMeta`](../interfaces/tablemeta.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\>

You can pass any object to `options.meta` and access it anywhere the `table` is available via `table.options.meta`.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#meta)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **newOptions.onColumnFiltersChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`ColumnFiltersState`](../type-aliases/columnfiltersstate.md)\>

If provided, this function will be called with an `updaterFn` when `state.columnFilters` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#oncolumnfilterschange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

• **newOptions.onColumnOrderChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`ColumnOrderState`](../type-aliases/columnorderstate.md)\>

If provided, this function will be called with an `updaterFn` when `state.columnOrder` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-ordering#oncolumnorderchange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-ordering)

• **newOptions.onColumnPinningChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`ColumnPinningState`](../interfaces/columnpinningstate.md)\>

If provided, this function will be called with an `updaterFn` when `state.columnPinning` changes. This overrides the default internal state management, so you will also need to supply `state.columnPinning` from your own managed state.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#oncolumnpinningchange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/oncolumnpinningchange)

• **newOptions.onColumnSizingChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`ColumnSizingState`](../type-aliases/columnsizingstate.md)\>

If provided, this function will be called with an `updaterFn` when `state.columnSizing` changes. This overrides the default internal state management, so you will also need to supply `state.columnSizing` from your own managed state.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#oncolumnsizingchange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

• **newOptions.onColumnSizingInfoChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`ColumnResizingInfoState`](../interfaces/columnresizinginfostate.md)\>

If provided, this function will be called with an `updaterFn` when `state.columnSizingInfo` changes. This overrides the default internal state management, so you will also need to supply `state.columnSizingInfo` from your own managed state.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#oncolumnsizinginfochange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

• **newOptions.onColumnVisibilityChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`ColumnVisibilityState`](../type-aliases/columnvisibilitystate.md)\>

If provided, this function will be called with an `updaterFn` when `state.columnVisibility` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#oncolumnvisibilitychange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

• **newOptions.onExpandedChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`ExpandedState`](../type-aliases/expandedstate.md)\>

This function is called when the `expanded` table state changes. If a function is provided, you will be responsible for managing this state on your own. To pass the managed state back to the table, use the `tableOptions.state.expanded` option.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#onexpandedchange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

• **newOptions.onGlobalFilterChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<`any`\>

If provided, this function will be called with an `updaterFn` when `state.globalFilter` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#onglobalfilterchange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)

• **newOptions.onGroupingChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`GroupingState`](../type-aliases/groupingstate.md)\>

If this function is provided, it will be called when the grouping state changes and you will be expected to manage the state yourself. You can pass the managed state back to the table via the `tableOptions.state.grouping` option.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#ongroupingchange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

• **newOptions.onPaginationChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`PaginationState`](../interfaces/paginationstate.md)\>

If this function is provided, it will be called when the pagination state changes and you will be expected to manage the state yourself. You can pass the managed state back to the table via the `tableOptions.state.pagination` option.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#onpaginationchange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

• **newOptions.onRowPinningChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`RowPinningState`](../interfaces/rowpinningstate.md)\>

If provided, this function will be called with an `updaterFn` when `state.rowPinning` changes. This overrides the default internal state management, so you will also need to supply `state.rowPinning` from your own managed state.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#onrowpinningchange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/onrowpinningchange)

• **newOptions.onRowSelectionChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`RowSelectionState`](../type-aliases/rowselectionstate.md)\>

If provided, this function will be called with an `updaterFn` when `state.rowSelection` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#onrowselectionchange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

• **newOptions.onSortingChange?**: [`OnChangeFn`](../type-aliases/onchangefn.md)\<[`SortingState`](../type-aliases/sortingstate.md)\>

If provided, this function will be called with an `updaterFn` when `state.sorting` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#onsortingchange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

• **newOptions.onStateChange?**

The `onStateChange` option can be used to optionally listen to state changes within the table.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#onstatechange)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **newOptions.pageCount?**: `number`

When manually controlling pagination, you can supply a total `pageCount` value to the table if you know it (Or supply a `rowCount` and `pageCount` will be calculated). If you do not know how many pages there are, you can set this to `-1`.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#pagecount)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

• **newOptions.paginateExpandedRows?**: `boolean`

If `true` expanded rows will be paginated along with the rest of the table (which means expanded rows may span multiple pages). If `false` expanded rows will not be considered for pagination (which means expanded rows will always render on their parents page. This also means more rows will be rendered than the set page size)

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#paginateexpandedrows)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

• **newOptions.renderFallbackValue?**: `any`

Value used when the desired value is not found in the data.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#renderfallbackvalue)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

• **newOptions.rowCount?**: `number`

When manually controlling pagination, you can supply a total `rowCount` value to the table if you know it. The `pageCount` can be calculated from this value and the `pageSize`.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#rowcount)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

• **newOptions.sortDescFirst?**: `boolean`

If `true`, all sorts will default to descending as their first toggle state.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#sortdescfirst)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

• **newOptions.sortingFns?**: `Record`\<`string`, [`SortingFn`](../interfaces/sortingfn.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\>\>

• **newOptions.state?**: `Partial`\<`object`\>

The `state` option can be used to optionally _control_ part or all of the table state. The state you pass here will merge with and overwrite the internal automatically-managed state to produce the final state for the table. You can also listen to state changes via the `onStateChange` option.
> Note: Any state passed in here will override both the internal state and any other `initialState` you provide.

**Link**

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#state)

**Link**

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

## Returns

`object`

### \_features

```ts
_features: TableFeatures;
```

The features that you want to enable for the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#_features)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

### \_rowModels?

```ts
optional _rowModels: RowModelOptions<TableFeatures, TData>;
```

The row model options that you want to enable for the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#_rowmodels)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

### aggregationFns?

```ts
optional aggregationFns: Record<string, AggregationFn<TableFeatures, TData>>;
```

### autoResetAll?

```ts
optional autoResetAll: boolean;
```

Set this option to override any of the `autoReset...` feature options.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#autoresetall)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

### autoResetExpanded?

```ts
optional autoResetExpanded: boolean;
```

Enable this setting to automatically reset the expanded state of the table when expanding state changes.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#autoresetexpanded)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

### autoResetPageIndex?

```ts
optional autoResetPageIndex: boolean;
```

If set to `true`, pagination will be reset to the first page when page-altering state changes eg. `data` is updated, filters change, grouping changes, etc.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#autoresetpageindex)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

### columnResizeDirection?

```ts
optional columnResizeDirection: ColumnResizeDirection;
```

Enables or disables right-to-left support for resizing the column. defaults to 'ltr'.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#columnResizeDirection)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

### columnResizeMode?

```ts
optional columnResizeMode: ColumnResizeMode;
```

Determines when the columnSizing state is updated. `onChange` updates the state when the user is dragging the resize handle. `onEnd` updates the state when the user releases the resize handle.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#columnresizemode)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

### columns

```ts
columns: ColumnDef<TableFeatures, TData, unknown>[];
```

The array of column defs to use for the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#columns)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

### data

```ts
data: TData[];
```

The data for the table to display. This array should match the type you provided to `table.setRowType<...>`. Columns can access this data via string/index or a functional accessor. When the `data` option changes reference, the table will reprocess the data.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#data)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

### debugAll?

```ts
optional debugAll: boolean;
```

Set this option to `true` to output all debugging information to the console.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugall)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

### debugCells?

```ts
optional debugCells: boolean;
```

Set this option to `true` to output cell debugging information to the console.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugcells]

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

### debugColumns?

```ts
optional debugColumns: boolean;
```

Set this option to `true` to output column debugging information to the console.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugcolumns)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

### debugHeaders?

```ts
optional debugHeaders: boolean;
```

Set this option to `true` to output header debugging information to the console.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugheaders)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

### debugRows?

```ts
optional debugRows: boolean;
```

Set this option to `true` to output row debugging information to the console.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugrows)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

### debugTable?

```ts
optional debugTable: boolean;
```

Set this option to `true` to output table debugging information to the console.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugtable)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

### defaultColumn?

```ts
optional defaultColumn: Partial<ColumnDef<TableFeatures, TData, unknown>>;
```

Default column options to use for all column defs supplied to the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#defaultcolumn)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

### enableColumnFilters?

```ts
optional enableColumnFilters: boolean;
```

Enables/disables **column** filtering for all columns.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#enablecolumnfilters)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

### enableColumnPinning?

```ts
optional enableColumnPinning: boolean;
```

Enables/disables column pinning for the table. Defaults to `true`.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#enablecolumnpinning)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)

### enableColumnResizing?

```ts
optional enableColumnResizing: boolean;
```

Enables or disables column resizing for the column.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#enablecolumnresizing)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

### enableExpanding?

```ts
optional enableExpanding: boolean;
```

Enable/disable expanding for all rows.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#enableexpanding)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

### enableFilters?

```ts
optional enableFilters: boolean;
```

Enables/disables all filtering for the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#enablefilters)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

### enableGlobalFilter?

```ts
optional enableGlobalFilter: boolean;
```

Enables/disables **global** filtering for all columns.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#enableglobalfilter)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)

### enableGrouping?

```ts
optional enableGrouping: boolean;
```

Enables/disables grouping for the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#enablegrouping)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

### enableHiding?

```ts
optional enableHiding: boolean;
```

Whether to enable column hiding. Defaults to `true`.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#enablehiding)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

### enableMultiRemove?

```ts
optional enableMultiRemove: boolean;
```

Enables/disables the ability to remove multi-sorts

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablemultiremove)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

### enableMultiRowSelection?

```ts
optional enableMultiRowSelection: boolean | (row) => boolean;
```

- Enables/disables multiple row selection for all rows in the table OR
- A function that given a row, returns whether to enable/disable multiple row selection for that row's children/grandchildren

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#enablemultirowselection)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

### enableMultiSort?

```ts
optional enableMultiSort: boolean;
```

Enables/Disables multi-sorting for the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablemultisort)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

### ~~enablePinning?~~

```ts
optional enablePinning: boolean;
```

#### Deprecated

Use `enableColumnPinning` or `enableRowPinning` instead.
Enables/disables all pinning for the table. Defaults to `true`.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#enablepinning)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)

### enableRowPinning?

```ts
optional enableRowPinning: boolean | (row) => boolean;
```

Enables/disables row pinning for the table. Defaults to `true`.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#enablerowpinning)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)

### enableRowSelection?

```ts
optional enableRowSelection: boolean | (row) => boolean;
```

- Enables/disables row selection for all rows in the table OR
- A function that given a row, returns whether to enable/disable row selection for that row

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#enablerowselection)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

### enableSorting?

```ts
optional enableSorting: boolean;
```

Enables/Disables sorting for the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablesorting)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

### enableSortingRemoval?

```ts
optional enableSortingRemoval: boolean;
```

Enables/Disables the ability to remove sorting for the table.
- If `true` then changing sort order will circle like: 'none' -> 'desc' -> 'asc' -> 'none' -> ...
- If `false` then changing sort order will circle like: 'none' -> 'desc' -> 'asc' -> 'desc' -> 'asc' -> ...

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablesortingremoval)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

### enableSubRowSelection?

```ts
optional enableSubRowSelection: boolean | (row) => boolean;
```

Enables/disables automatic sub-row selection when a parent row is selected, or a function that enables/disables automatic sub-row selection for each row.
(Use in combination with expanding or grouping features)

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#enablesubrowselection)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

### filterFns?

```ts
optional filterFns: Record<string, FilterFn<TableFeatures, TData>>;
```

### filterFromLeafRows?

```ts
optional filterFromLeafRows: boolean;
```

By default, filtering is done from parent rows down (so if a parent row is filtered out, all of its children will be filtered out as well). Setting this option to `true` will cause filtering to be done from leaf rows up (which means parent rows will be included so long as one of their child or grand-child rows is also included).

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#filterfromleafrows)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

### getColumnCanGlobalFilter()?

```ts
optional getColumnCanGlobalFilter: <TFeatures, TData, TValue>(column) => boolean;
```

If provided, this function will be called with the column and should return `true` or `false` to indicate whether this column should be used for global filtering.

This is useful if the column can contain data that is not `string` or `number` (i.e. `undefined`).

#### Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

#### Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#getcolumncanglobalfilter)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)

### getIsRowExpanded()?

```ts
optional getIsRowExpanded: (row) => boolean;
```

If provided, allows you to override the default behavior of determining whether a row is currently expanded.

#### Parameters

• **row**: [`Row`](../type-aliases/row.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\>

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getisrowexpanded)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

### getRowCanExpand()?

```ts
optional getRowCanExpand: (row) => boolean;
```

If provided, allows you to override the default behavior of determining whether a row can be expanded.

#### Parameters

• **row**: [`Row`](../type-aliases/row.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\>

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getrowcanexpand)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

### getRowId()?

```ts
optional getRowId: (originalRow, index, parent?) => string;
```

This optional function is used to derive a unique ID for any given row. If not provided the rows index is used (nested rows join together with `.` using their grandparents' index eg. `index.index.index`). If you need to identify individual rows that are originating from any server-side operations, it's suggested you use this function to return an ID that makes sense regardless of network IO/ambiguity eg. a userId, taskId, database ID field, etc.

#### Parameters

• **originalRow**: `TData`

• **index**: `number`

• **parent?**: [`Row`](../type-aliases/row.md)\<[`TableFeatures`](../interfaces/tablefeatures.md), `TData`\>

#### Returns

`string`

#### Example

```ts
getRowId: row => row.userId
```

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#getrowid)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

### getSubRows()?

```ts
optional getSubRows: (originalRow, index) => undefined | TData[];
```

This optional function is used to access the sub rows for any given row. If you are using nested rows, you will need to use this function to return the sub rows object (or undefined) from the row.

#### Parameters

• **originalRow**: `TData`

• **index**: `number`

#### Returns

`undefined` \| `TData`[]

#### Example

```ts
getSubRows: row => row.subRows
```

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#getsubrows)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

### globalFilterFn?

```ts
optional globalFilterFn: FilterFnOption<TableFeatures, TData>;
```

The filter function to use for global filtering.
- A `string` referencing a built-in filter function
- A `string` that references a custom filter functions provided via the `tableOptions.filterFns` option
- A custom filter function

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#globalfilterfn)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)

### groupedColumnMode?

```ts
optional groupedColumnMode: false | "reorder" | "remove";
```

Grouping columns are automatically reordered by default to the start of the columns list. If you would rather remove them or leave them as-is, set the appropriate mode here.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#groupedcolumnmode)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

### initialState?

```ts
optional initialState: Partial<object>;
```

Use this option to optionally pass initial state to the table. This state will be used when resetting various table states either automatically by the table (eg. `options.autoResetPageIndex`) or via functions like `table.resetRowSelection()`. Most reset function allow you optionally pass a flag to reset to a blank/default state instead of the initial state.

Table state will not be reset when this object changes, which also means that the initial state object does not need to be stable.

#### Type declaration

##### columnFilters

```ts
columnFilters: ColumnFiltersState;
```

##### columnOrder

```ts
columnOrder: ColumnOrderState;
```

##### columnPinning

```ts
columnPinning: ColumnPinningState;
```

##### columnSizing

```ts
columnSizing: ColumnSizingState;
```

##### columnSizingInfo

```ts
columnSizingInfo: ColumnResizingInfoState;
```

##### columnVisibility

```ts
columnVisibility: ColumnVisibilityState;
```

##### expanded

```ts
expanded: ExpandedState;
```

##### globalFilter

```ts
globalFilter: any;
```

##### grouping

```ts
grouping: GroupingState;
```

##### pagination

```ts
pagination: PaginationState;
```

##### rowPinning

```ts
rowPinning: RowPinningState;
```

##### rowSelection

```ts
rowSelection: RowSelectionState;
```

##### sorting

```ts
sorting: SortingState;
```

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#initialstate)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

### isMultiSortEvent()?

```ts
optional isMultiSortEvent: (e) => boolean;
```

Pass a custom function that will be used to determine if a multi-sort event should be triggered. It is passed the event from the sort toggle handler and should return `true` if the event should trigger a multi-sort.

#### Parameters

• **e**: `unknown`

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#ismultisortevent)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

### keepPinnedRows?

```ts
optional keepPinnedRows: boolean;
```

When `false`, pinned rows will not be visible if they are filtered or paginated out of the table. When `true`, pinned rows will always be visible regardless of filtering or pagination. Defaults to `true`.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#keeppinnedrows)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)

### manualExpanding?

```ts
optional manualExpanding: boolean;
```

Enables manual row expansion. If this is set to `true`, `getExpandedRowModel` will not be used to expand rows and you would be expected to perform the expansion in your own data model. This is useful if you are doing server-side expansion.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#manualexpanding)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

### manualFiltering?

```ts
optional manualFiltering: boolean;
```

Disables the `getFilteredRowModel` from being used to filter data. This may be useful if your table needs to dynamically support both client-side and server-side filtering.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#manualfiltering)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

### manualGrouping?

```ts
optional manualGrouping: boolean;
```

Enables manual grouping. If this option is set to `true`, the table will not automatically group rows using `getGroupedRowModel()` and instead will expect you to manually group the rows before passing them to the table. This is useful if you are doing server-side grouping and aggregation.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#manualgrouping)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

### manualPagination?

```ts
optional manualPagination: boolean;
```

Enables manual pagination. If this option is set to `true`, the table will not automatically paginate rows using `getPaginatedRowModel()` and instead will expect you to manually paginate the rows before passing them to the table. This is useful if you are doing server-side pagination and aggregation.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#manualpagination)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

### manualSorting?

```ts
optional manualSorting: boolean;
```

Enables manual sorting for the table. If this is `true`, you will be expected to sort your data before it is passed to the table. This is useful if you are doing server-side sorting.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#manualsorting)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

### maxLeafRowFilterDepth?

```ts
optional maxLeafRowFilterDepth: number;
```

By default, filtering is done for all rows (max depth of 100), no matter if they are root level parent rows or the child leaf rows of a parent row. Setting this option to `0` will cause filtering to only be applied to the root level parent rows, with all sub-rows remaining unfiltered. Similarly, setting this option to `1` will cause filtering to only be applied to child leaf rows 1 level deep, and so on.

This is useful for situations where you want a row's entire child hierarchy to be visible regardless of the applied filter.
 *

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#maxleafrowfilterdepth)
 *

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

### maxMultiSortColCount?

```ts
optional maxMultiSortColCount: number;
```

Set a maximum number of columns that can be multi-sorted.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#maxmultisortcolcount)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

### mergeOptions()?

```ts
optional mergeOptions: (defaultOptions, options) => { _features: TableFeatures; _rowModels?: RowModelOptions<TableFeatures, TData> | undefined; autoResetAll?: boolean | undefined; ... 72 more ...; sortingFns?: Record<...> | undefined; };
```

This option is used to optionally implement the merging of table options.

#### Parameters

• **defaultOptions**: \{ \_features: TableFeatures; \_rowModels?: RowModelOptions\<TableFeatures, TData\> \| undefined; autoResetAll?: boolean \| undefined; ... 72 more ...; sortingFns?: Record\<...\> \| undefined; \}

• **options**: `Partial`\<\{ \_features: TableFeatures; \_rowModels?: RowModelOptions\<TableFeatures, TData\> \| undefined; autoResetAll?: boolean \| undefined; ... 72 more ...; sortingFns?: Record\<...\> \| undefined; \}\>

#### Returns

\{ \_features: TableFeatures; \_rowModels?: RowModelOptions\<TableFeatures, TData\> \| undefined; autoResetAll?: boolean \| undefined; ... 72 more ...; sortingFns?: Record\<...\> \| undefined; \}

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#mergeoptions)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

### meta?

```ts
optional meta: TableMeta<TableFeatures, TData>;
```

You can pass any object to `options.meta` and access it anywhere the `table` is available via `table.options.meta`.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#meta)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

### onColumnFiltersChange?

```ts
optional onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
```

If provided, this function will be called with an `updaterFn` when `state.columnFilters` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#oncolumnfilterschange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

### onColumnOrderChange?

```ts
optional onColumnOrderChange: OnChangeFn<ColumnOrderState>;
```

If provided, this function will be called with an `updaterFn` when `state.columnOrder` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-ordering#oncolumnorderchange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-ordering)

### onColumnPinningChange?

```ts
optional onColumnPinningChange: OnChangeFn<ColumnPinningState>;
```

If provided, this function will be called with an `updaterFn` when `state.columnPinning` changes. This overrides the default internal state management, so you will also need to supply `state.columnPinning` from your own managed state.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#oncolumnpinningchange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/oncolumnpinningchange)

### onColumnSizingChange?

```ts
optional onColumnSizingChange: OnChangeFn<ColumnSizingState>;
```

If provided, this function will be called with an `updaterFn` when `state.columnSizing` changes. This overrides the default internal state management, so you will also need to supply `state.columnSizing` from your own managed state.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#oncolumnsizingchange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

### onColumnSizingInfoChange?

```ts
optional onColumnSizingInfoChange: OnChangeFn<ColumnResizingInfoState>;
```

If provided, this function will be called with an `updaterFn` when `state.columnSizingInfo` changes. This overrides the default internal state management, so you will also need to supply `state.columnSizingInfo` from your own managed state.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#oncolumnsizinginfochange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

### onColumnVisibilityChange?

```ts
optional onColumnVisibilityChange: OnChangeFn<ColumnVisibilityState>;
```

If provided, this function will be called with an `updaterFn` when `state.columnVisibility` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#oncolumnvisibilitychange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

### onExpandedChange?

```ts
optional onExpandedChange: OnChangeFn<ExpandedState>;
```

This function is called when the `expanded` table state changes. If a function is provided, you will be responsible for managing this state on your own. To pass the managed state back to the table, use the `tableOptions.state.expanded` option.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#onexpandedchange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

### onGlobalFilterChange?

```ts
optional onGlobalFilterChange: OnChangeFn<any>;
```

If provided, this function will be called with an `updaterFn` when `state.globalFilter` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#onglobalfilterchange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)

### onGroupingChange?

```ts
optional onGroupingChange: OnChangeFn<GroupingState>;
```

If this function is provided, it will be called when the grouping state changes and you will be expected to manage the state yourself. You can pass the managed state back to the table via the `tableOptions.state.grouping` option.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#ongroupingchange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

### onPaginationChange?

```ts
optional onPaginationChange: OnChangeFn<PaginationState>;
```

If this function is provided, it will be called when the pagination state changes and you will be expected to manage the state yourself. You can pass the managed state back to the table via the `tableOptions.state.pagination` option.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#onpaginationchange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

### onRowPinningChange?

```ts
optional onRowPinningChange: OnChangeFn<RowPinningState>;
```

If provided, this function will be called with an `updaterFn` when `state.rowPinning` changes. This overrides the default internal state management, so you will also need to supply `state.rowPinning` from your own managed state.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#onrowpinningchange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/onrowpinningchange)

### onRowSelectionChange?

```ts
optional onRowSelectionChange: OnChangeFn<RowSelectionState>;
```

If provided, this function will be called with an `updaterFn` when `state.rowSelection` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#onrowselectionchange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

### onSortingChange?

```ts
optional onSortingChange: OnChangeFn<SortingState>;
```

If provided, this function will be called with an `updaterFn` when `state.sorting` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#onsortingchange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

### onStateChange()?

```ts
optional onStateChange: (updater) => void;
```

The `onStateChange` option can be used to optionally listen to state changes within the table.

#### Parameters

• **updater**: [`Updater`](../type-aliases/updater.md)\<`object`\>

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#onstatechange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

### pageCount?

```ts
optional pageCount: number;
```

When manually controlling pagination, you can supply a total `pageCount` value to the table if you know it (Or supply a `rowCount` and `pageCount` will be calculated). If you do not know how many pages there are, you can set this to `-1`.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#pagecount)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

### paginateExpandedRows?

```ts
optional paginateExpandedRows: boolean;
```

If `true` expanded rows will be paginated along with the rest of the table (which means expanded rows may span multiple pages). If `false` expanded rows will not be considered for pagination (which means expanded rows will always render on their parents page. This also means more rows will be rendered than the set page size)

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#paginateexpandedrows)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

### renderFallbackValue?

```ts
optional renderFallbackValue: any;
```

Value used when the desired value is not found in the data.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#renderfallbackvalue)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

### rowCount?

```ts
optional rowCount: number;
```

When manually controlling pagination, you can supply a total `rowCount` value to the table if you know it. The `pageCount` can be calculated from this value and the `pageSize`.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#rowcount)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

### sortDescFirst?

```ts
optional sortDescFirst: boolean;
```

If `true`, all sorts will default to descending as their first toggle state.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#sortdescfirst)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

### sortingFns?

```ts
optional sortingFns: Record<string, SortingFn<TableFeatures, TData>>;
```

### state?

```ts
optional state: Partial<object>;
```

The `state` option can be used to optionally _control_ part or all of the table state. The state you pass here will merge with and overwrite the internal automatically-managed state to produce the final state for the table. You can also listen to state changes via the `onStateChange` option.
> Note: Any state passed in here will override both the internal state and any other `initialState` you provide.

#### Type declaration

##### columnFilters

```ts
columnFilters: ColumnFiltersState;
```

##### columnOrder

```ts
columnOrder: ColumnOrderState;
```

##### columnPinning

```ts
columnPinning: ColumnPinningState;
```

##### columnSizing

```ts
columnSizing: ColumnSizingState;
```

##### columnSizingInfo

```ts
columnSizingInfo: ColumnResizingInfoState;
```

##### columnVisibility

```ts
columnVisibility: ColumnVisibilityState;
```

##### expanded

```ts
expanded: ExpandedState;
```

##### globalFilter

```ts
globalFilter: any;
```

##### grouping

```ts
grouping: GroupingState;
```

##### pagination

```ts
pagination: PaginationState;
```

##### rowPinning

```ts
rowPinning: RowPinningState;
```

##### rowSelection

```ts
rowSelection: RowSelectionState;
```

##### sorting

```ts
sorting: SortingState;
```

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#state)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

## Defined in

[core/table/Tables.utils.ts:18](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/table/Tables.utils.ts#L18)

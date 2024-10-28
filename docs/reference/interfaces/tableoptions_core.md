---
id: TableOptions_Core
title: TableOptions_Core
---

# Interface: TableOptions\_Core\<TFeatures, TData\>

## Extends

- [`TableOptions_Table`](tableoptions_table.md)\<`TFeatures`, `TData`\>.[`TableOptions_Cell`](tableoptions_cell.md).[`TableOptions_Columns`](tableoptions_columns.md)\<`TFeatures`, `TData`\>.[`TableOptions_Rows`](tableoptions_rows.md)\<`TFeatures`, `TData`\>.[`TableOptions_Headers`](tableoptions_headers.md)

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### \_features

```ts
_features: TFeatures;
```

The features that you want to enable for the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#_features)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`TableOptions_Table`](tableoptions_table.md).[`_features`](TableOptions_Table.md#_features)

#### Defined in

[core/table/Tables.types.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L25)

***

### \_processingFns?

```ts
optional _processingFns: ProcessingFns<TFeatures, TData>;
```

The processing functions that are used to process the data by features.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#_processingFns)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`TableOptions_Table`](tableoptions_table.md).[`_processingFns`](TableOptions_Table.md#_processingfns)

#### Defined in

[core/table/Tables.types.ts:31](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L31)

***

### \_rowModels?

```ts
optional _rowModels: CreateRowModels<TFeatures, TData>;
```

The row model options that you want to enable for the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#_rowmodels)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`TableOptions_Table`](tableoptions_table.md).[`_rowModels`](TableOptions_Table.md#_rowmodels)

#### Defined in

[core/table/Tables.types.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L37)

***

### autoResetAll?

```ts
optional autoResetAll: boolean;
```

Set this option to override any of the `autoReset...` feature options.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#autoresetall)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`TableOptions_Table`](tableoptions_table.md).[`autoResetAll`](TableOptions_Table.md#autoresetall)

#### Defined in

[core/table/Tables.types.ts:43](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L43)

***

### columns

```ts
columns: ColumnDef<TFeatures, TData, unknown>[];
```

The array of column defs to use for the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#columns)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`TableOptions_Columns`](tableoptions_columns.md).[`columns`](TableOptions_Columns.md#columns)

#### Defined in

[core/columns/Columns.types.ts:86](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/Columns.types.ts#L86)

***

### data

```ts
data: TData[];
```

The data for the table to display. This array should match the type you provided to `table.setRowType<...>`. Columns can access this data via string/index or a functional accessor. When the `data` option changes reference, the table will reprocess the data.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#data)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`TableOptions_Table`](tableoptions_table.md).[`data`](TableOptions_Table.md#data)

#### Defined in

[core/table/Tables.types.ts:49](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L49)

***

### debugAll?

```ts
optional debugAll: boolean;
```

Set this option to `true` to output all debugging information to the console.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugall)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`TableOptions_Table`](tableoptions_table.md).[`debugAll`](TableOptions_Table.md#debugall)

#### Defined in

[core/table/Tables.types.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L55)

***

### debugCells?

```ts
optional debugCells: boolean;
```

Set this option to `true` to output cell debugging information to the console.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugcells]

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`TableOptions_Cell`](tableoptions_cell.md).[`debugCells`](TableOptions_Cell.md#debugcells)

#### Defined in

[core/cells/Cells.types.ts:81](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/Cells.types.ts#L81)

***

### debugColumns?

```ts
optional debugColumns: boolean;
```

Set this option to `true` to output column debugging information to the console.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugcolumns)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`TableOptions_Columns`](tableoptions_columns.md).[`debugColumns`](TableOptions_Columns.md#debugcolumns)

#### Defined in

[core/columns/Columns.types.ts:92](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/Columns.types.ts#L92)

***

### debugHeaders?

```ts
optional debugHeaders: boolean;
```

Set this option to `true` to output header debugging information to the console.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugheaders)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`TableOptions_Headers`](tableoptions_headers.md).[`debugHeaders`](TableOptions_Headers.md#debugheaders)

#### Defined in

[core/headers/Headers.types.ts:14](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/Headers.types.ts#L14)

***

### debugRows?

```ts
optional debugRows: boolean;
```

Set this option to `true` to output row debugging information to the console.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugrows)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`TableOptions_Rows`](tableoptions_rows.md).[`debugRows`](TableOptions_Rows.md#debugrows)

#### Defined in

[core/rows/Rows.types.ts:117](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L117)

***

### debugTable?

```ts
optional debugTable: boolean;
```

Set this option to `true` to output table debugging information to the console.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugtable)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`TableOptions_Table`](tableoptions_table.md).[`debugTable`](TableOptions_Table.md#debugtable)

#### Defined in

[core/table/Tables.types.ts:61](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L61)

***

### defaultColumn?

```ts
optional defaultColumn: Partial<ColumnDef<TFeatures, TData, unknown>>;
```

Default column options to use for all column defs supplied to the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#defaultcolumn)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`TableOptions_Columns`](tableoptions_columns.md).[`defaultColumn`](TableOptions_Columns.md#defaultcolumn)

#### Defined in

[core/columns/Columns.types.ts:98](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/Columns.types.ts#L98)

***

### getRowId()?

```ts
optional getRowId: (originalRow, index, parent?) => string;
```

This optional function is used to derive a unique ID for any given row. If not provided the rows index is used (nested rows join together with `.` using their grandparents' index eg. `index.index.index`). If you need to identify individual rows that are originating from any server-side operations, it's suggested you use this function to return an ID that makes sense regardless of network IO/ambiguity eg. a userId, taskId, database ID field, etc.

#### Parameters

• **originalRow**: `TData`

• **index**: `number`

• **parent?**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

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

#### Inherited from

[`TableOptions_Rows`](tableoptions_rows.md).[`getRowId`](TableOptions_Rows.md#getrowid)

#### Defined in

[core/rows/Rows.types.ts:124](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L124)

***

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

#### Inherited from

[`TableOptions_Rows`](tableoptions_rows.md).[`getSubRows`](TableOptions_Rows.md#getsubrows)

#### Defined in

[core/rows/Rows.types.ts:135](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L135)

***

### initialState?

```ts
optional initialState: Partial<TableState<TFeatures>>;
```

Use this option to optionally pass initial state to the table. This state will be used when resetting various table states either automatically by the table (eg. `options.autoResetPageIndex`) or via functions like `table.resetRowSelection()`. Most reset function allow you optionally pass a flag to reset to a blank/default state instead of the initial state.

Table state will not be reset when this object changes, which also means that the initial state object does not need to be stable.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#initialstate)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`TableOptions_Table`](tableoptions_table.md).[`initialState`](TableOptions_Table.md#initialstate)

#### Defined in

[core/table/Tables.types.ts:70](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L70)

***

### mergeOptions()?

```ts
optional mergeOptions: (defaultOptions, options) => TableOptions<TFeatures, TData>;
```

This option is used to optionally implement the merging of table options.

#### Parameters

• **defaultOptions**: [`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>

• **options**: `Partial`\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>\>

#### Returns

[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#mergeoptions)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`TableOptions_Table`](tableoptions_table.md).[`mergeOptions`](TableOptions_Table.md#mergeoptions)

#### Defined in

[core/table/Tables.types.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L76)

***

### meta?

```ts
optional meta: TableMeta<TFeatures, TData>;
```

You can pass any object to `options.meta` and access it anywhere the `table` is available via `table.options.meta`.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#meta)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`TableOptions_Table`](tableoptions_table.md).[`meta`](TableOptions_Table.md#meta)

#### Defined in

[core/table/Tables.types.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L85)

***

### onStateChange()?

```ts
optional onStateChange: (updater) => void;
```

The `onStateChange` option can be used to optionally listen to state changes within the table.

#### Parameters

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`TableState`](../type-aliases/tablestate.md)\<`TFeatures`\>\>

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#onstatechange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`TableOptions_Table`](tableoptions_table.md).[`onStateChange`](TableOptions_Table.md#onstatechange)

#### Defined in

[core/table/Tables.types.ts:91](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L91)

***

### renderFallbackValue?

```ts
optional renderFallbackValue: any;
```

Value used when the desired value is not found in the data.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#renderfallbackvalue)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`TableOptions_Cell`](tableoptions_cell.md).[`renderFallbackValue`](TableOptions_Cell.md#renderfallbackvalue)

#### Defined in

[core/cells/Cells.types.ts:87](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/Cells.types.ts#L87)

***

### state?

```ts
optional state: Partial<TableState<TFeatures>>;
```

The `state` option can be used to optionally _control_ part or all of the table state. The state you pass here will merge with and overwrite the internal automatically-managed state to produce the final state for the table. You can also listen to state changes via the `onStateChange` option.
> Note: Any state passed in here will override both the internal state and any other `initialState` you provide.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#state)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`TableOptions_Table`](tableoptions_table.md).[`state`](TableOptions_Table.md#state)

#### Defined in

[core/table/Tables.types.ts:98](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L98)

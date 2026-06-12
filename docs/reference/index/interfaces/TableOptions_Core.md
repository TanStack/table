---
id: TableOptions_Core
title: TableOptions_Core
---

# Interface: TableOptions\_Core\<TFeatures, TData\>

Defined in: [types/TableOptions.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableOptions.ts#L30)

Core options that are always available on a table, before optional feature
options are mixed in.

## Extends

- [`TableOptions_Table`](TableOptions_Table.md)\<`TFeatures`, `TData`\>.[`TableOptions_Cell`](TableOptions_Cell.md).[`TableOptions_Columns`](TableOptions_Columns.md)\<`TFeatures`, `TData`\>.[`TableOptions_Rows`](TableOptions_Rows.md)\<`TFeatures`, `TData`\>

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### atoms?

```ts
readonly optional atoms: Partial<{ [K in string | number | symbol]: Atom<ExtractFeatureMapTypes<TFeatures, TableState_FeatureMap>[K]> }>;
```

Defined in: [core/table/coreTablesFeature.types.ts:107](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L107)

Optionally, provide your own external writable atoms for individual state slices.
When an atom is provided for a given slice, it takes precedence over `options.state[key]`
and the internal base atom for that slice. Feature state update APIs write through
the corresponding atom updater, so external atoms are the preferred v9 ownership
model for app-managed table state slices.

#### Inherited from

[`TableOptions_Table`](TableOptions_Table.md).[`atoms`](TableOptions_Table.md#atoms)

***

### autoResetAll?

```ts
readonly optional autoResetAll: boolean;
```

Defined in: [core/table/coreTablesFeature.types.ts:111](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L111)

Set this option to override any of the `autoReset...` feature options.

#### Inherited from

[`TableOptions_Table`](TableOptions_Table.md).[`autoResetAll`](TableOptions_Table.md#autoresetall)

***

### columns

```ts
columns: readonly ColumnDef<TFeatures, TData, unknown>[];
```

Defined in: [core/columns/coreColumnsFeature.types.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L69)

The array of column defs to use for the table.

#### Inherited from

[`TableOptions_Columns`](TableOptions_Columns.md).[`columns`](TableOptions_Columns.md#columns)

***

### data

```ts
readonly data: readonly TData[];
```

Defined in: [core/table/coreTablesFeature.types.ts:115](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L115)

The data for the table to display. When the `data` option changes reference, the table will reprocess the data.

#### Inherited from

[`TableOptions_Table`](TableOptions_Table.md).[`data`](TableOptions_Table.md#data)

***

### defaultColumn?

```ts
optional defaultColumn: Partial<ColumnDef<TFeatures, TData, unknown>>;
```

Defined in: [core/columns/coreColumnsFeature.types.ts:73](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L73)

Default column options to use for all column defs supplied to the table.

#### Inherited from

[`TableOptions_Columns`](TableOptions_Columns.md).[`defaultColumn`](TableOptions_Columns.md#defaultcolumn)

***

### features

```ts
readonly features: TFeatures & ValidateFeatureSlots<TFeatures>;
```

Defined in: [core/table/coreTablesFeature.types.ts:99](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L99)

The feature modules registered on this table instance.

Feature registration controls which state slices, options, and prototype
APIs are available. This object also carries the table's row model
factories (`sortedRowModel`, `filteredRowModel`, etc.), row model function
registries (`sortFns`, `filterFns`, `aggregationFns`), and type-only meta
slots (`tableMeta`, `columnMeta`).

#### Inherited from

[`TableOptions_Table`](TableOptions_Table.md).[`features`](TableOptions_Table.md#features)

***

### getRowId()?

```ts
optional getRowId: (originalRow, index, parent?) => string;
```

Defined in: [core/rows/coreRowsFeature.types.ts:93](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L93)

This optional function is used to derive a unique ID for any given row. If not provided the rows index is used (nested rows join together with `.` using their grandparents' index eg. `index.index.index`). If you need to identify individual rows that are originating from any server-side operations, it's suggested you use this function to return an ID that makes sense regardless of network IO/ambiguity eg. a userId, taskId, database ID field, etc.

#### Parameters

##### originalRow

`TData`

##### index

`number`

##### parent?

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

#### Returns

`string`

#### Example

```ts
getRowId: row => row.userId
```

#### Inherited from

[`TableOptions_Rows`](TableOptions_Rows.md).[`getRowId`](TableOptions_Rows.md#getrowid)

***

### getSubRows()?

```ts
optional getSubRows: (originalRow, index) => readonly TData[] | undefined;
```

Defined in: [core/rows/coreRowsFeature.types.ts:102](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L102)

This optional function is used to access the sub rows for any given row. If you are using nested rows, you will need to use this function to return the sub rows object (or undefined) from the row.

#### Parameters

##### originalRow

`TData`

##### index

`number`

#### Returns

readonly `TData`[] \| `undefined`

#### Example

```ts
getSubRows: row => row.subRows
```

#### Inherited from

[`TableOptions_Rows`](TableOptions_Rows.md).[`getSubRows`](TableOptions_Rows.md#getsubrows)

***

### initialState?

```ts
readonly optional initialState: Partial<ExtractFeatureMapTypes<TFeatures, TableState_FeatureMap>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:129](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L129)

Optionally provide starting values for registered table state slices.
Feature reset APIs use this value by default, and many reset APIs accept
`true` to reset to that feature's blank/default state instead. Changing this
object later does not reset table state, so it does not need to be stable.

#### Inherited from

[`TableOptions_Table`](TableOptions_Table.md).[`initialState`](TableOptions_Table.md#initialstate)

***

### key?

```ts
readonly optional key: string;
```

Defined in: [core/table/coreTablesFeature.types.ts:122](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L122)

Optional key used to identify this table instance.

This is used by TanStack Table Devtools to register and select tables. It is
not required unless the table is passed to devtools.

#### Inherited from

[`TableOptions_Table`](TableOptions_Table.md).[`key`](TableOptions_Table.md#key)

***

### mergeOptions()?

```ts
readonly optional mergeOptions: (defaultOptions, options) => TableOptions<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:133](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L133)

This option is used to optionally implement the merging of table options.

#### Parameters

##### defaultOptions

[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>

##### options

`Partial`\<[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>\>

#### Returns

[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>

#### Inherited from

[`TableOptions_Table`](TableOptions_Table.md).[`mergeOptions`](TableOptions_Table.md#mergeoptions)

***

### meta?

```ts
readonly optional meta: ExtractTableMeta<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:143](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L143)

You can pass any object to `options.meta` and access it anywhere the `table` is available via `table.options.meta`.

Declare its type per-table via the `tableMeta` type-only slot on the
`features` option, or globally via declaration merging on `TableMeta`.

#### Inherited from

[`TableOptions_Table`](TableOptions_Table.md).[`meta`](TableOptions_Table.md#meta)

***

### renderFallbackValue?

```ts
optional renderFallbackValue: any;
```

Defined in: [core/cells/coreCellsFeature.types.ts:67](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L67)

Value used when the desired value is not found in the data.

#### Inherited from

[`TableOptions_Cell`](TableOptions_Cell.md).[`renderFallbackValue`](TableOptions_Cell.md#renderfallbackvalue)

***

### state?

```ts
readonly optional state: Partial<ExtractFeatureMapTypes<TFeatures, TableState_FeatureMap>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:151](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L151)

Optionally provide externally managed values for individual state slices.

Pair each slice with its matching `on[State]Change` callback so table state
updates can be persisted outside the table. External atoms take precedence
over this option when both are provided for the same slice.

#### Inherited from

[`TableOptions_Table`](TableOptions_Table.md).[`state`](TableOptions_Table.md#state)

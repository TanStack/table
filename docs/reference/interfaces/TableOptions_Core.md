---
id: TableOptions_Core
title: TableOptions_Core
---

# Interface: TableOptions\_Core\<TFeatures, TData\>

Defined in: [types/TableOptions.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableOptions.ts#L27)

## Extends

- [`TableOptions_Table`](TableOptions_Table.md)\<`TFeatures`, `TData`\>.[`TableOptions_Cell`](TableOptions_Cell.md).[`TableOptions_Columns`](TableOptions_Columns.md)\<`TFeatures`, `TData`\>.[`TableOptions_Rows`](TableOptions_Rows.md)\<`TFeatures`, `TData`\>

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### \_features

```ts
_features: TFeatures;
```

Defined in: [core/table/coreTablesFeature.types.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L69)

The features that you want to enable for the table.

#### Inherited from

[`TableOptions_Table`](TableOptions_Table.md).[`_features`](TableOptions_Table.md#_features)

***

### \_rowModels?

```ts
optional _rowModels: CreateRowModels_All<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:73](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L73)

The row model options that you want to enable for the table.

#### Inherited from

[`TableOptions_Table`](TableOptions_Table.md).[`_rowModels`](TableOptions_Table.md#_rowmodels)

***

### atoms?

```ts
optional atoms: Partial<{ [K in string | number | symbol]: Atom<TableState<TFeatures>[K]> }>;
```

Defined in: [core/table/coreTablesFeature.types.ts:81](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L81)

Optionally, provide your own external writable atoms for individual state slices.
When an atom is provided for a given slice, it takes precedence over `options.state[key]`
and the internal base atom for that slice. Writes originating from the library are
still routed through the internal base atom; consumers are responsible for
mirroring changes back to their external atom via the corresponding `onXChange` callback.

#### Inherited from

[`TableOptions_Table`](TableOptions_Table.md).[`atoms`](TableOptions_Table.md#atoms)

***

### autoResetAll?

```ts
optional autoResetAll: boolean;
```

Defined in: [core/table/coreTablesFeature.types.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L85)

Set this option to override any of the `autoReset...` feature options.

#### Inherited from

[`TableOptions_Table`](TableOptions_Table.md).[`autoResetAll`](TableOptions_Table.md#autoresetall)

***

### columns

```ts
columns: readonly ColumnDef<TFeatures, TData, unknown>[];
```

Defined in: [core/columns/coreColumnsFeature.types.ts:68](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L68)

The array of column defs to use for the table.

#### Inherited from

[`TableOptions_Columns`](TableOptions_Columns.md).[`columns`](TableOptions_Columns.md#columns)

***

### data

```ts
data: readonly TData[];
```

Defined in: [core/table/coreTablesFeature.types.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L89)

The data for the table to display. When the `data` option changes reference, the table will reprocess the data.

#### Inherited from

[`TableOptions_Table`](TableOptions_Table.md).[`data`](TableOptions_Table.md#data)

***

### defaultColumn?

```ts
optional defaultColumn: Partial<ColumnDef<TFeatures, TData, unknown>>;
```

Defined in: [core/columns/coreColumnsFeature.types.ts:72](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L72)

Default column options to use for all column defs supplied to the table.

#### Inherited from

[`TableOptions_Columns`](TableOptions_Columns.md).[`defaultColumn`](TableOptions_Columns.md#defaultcolumn)

***

### getRowId()?

```ts
optional getRowId: (originalRow, index, parent?) => string;
```

Defined in: [core/rows/coreRowsFeature.types.ts:90](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L90)

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

Defined in: [core/rows/coreRowsFeature.types.ts:99](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L99)

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
optional initialState: Partial<TableState<TFeatures>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:94](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L94)

Use this option to optionally pass initial state to the table. This state will be used when resetting various table states either automatically by the table (eg. `options.autoResetPageIndex`) or via functions like `table.resetRowSelection()`. Most reset function allow you optionally pass a flag to reset to a blank/default state instead of the initial state.
Table state will not be reset when this object changes, which also means that the initial state object does not need to be stable.

#### Inherited from

[`TableOptions_Table`](TableOptions_Table.md).[`initialState`](TableOptions_Table.md#initialstate)

***

### mergeOptions()?

```ts
optional mergeOptions: (defaultOptions, options) => TableOptions<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:98](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L98)

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
optional meta: TableMeta<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:105](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L105)

You can pass any object to `options.meta` and access it anywhere the `table` is available via `table.options.meta`.

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
optional state: Partial<TableState<TFeatures>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:109](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L109)

Pass in individual self-managed state to the table.

#### Inherited from

[`TableOptions_Table`](TableOptions_Table.md).[`state`](TableOptions_Table.md#state)

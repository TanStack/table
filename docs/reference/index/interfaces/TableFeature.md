---
id: TableFeature
title: TableFeature
---

# Interface: TableFeature

Defined in: [types/TableFeatures.ts:319](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L319)

Lifecycle hooks and defaults contributed by a table feature.

Feature objects are registered in the table's `features` option. They can
contribute default state/options, default column definitions, table APIs,
shared prototype APIs for rows/columns/headers/cells, and per-instance data
for tables, columns, rows, headers, header groups, and cells.

## Properties

### assignCellPrototype()?

```ts
optional assignCellPrototype: <TFeatures, TData>(prototype, table) => void;
```

Defined in: [types/TableFeatures.ts:328](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L328)

Adds feature methods to the shared cell prototype for a table.

This runs lazily the first time a cell is constructed for a table. Methods
assigned here are shared by every cell instance created by that table, so
this hook should be used for APIs and memoized methods rather than
per-cell mutable data.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### prototype

`Record`\<`string`, `any`\>

##### table

[`Table_Internal`](Table_Internal.md)\<`TFeatures`, `TData`\>

#### Returns

`void`

***

### assignColumnPrototype()?

```ts
optional assignColumnPrototype: <TFeatures, TData>(prototype, table) => void;
```

Defined in: [types/TableFeatures.ts:343](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L343)

Adds feature methods to the shared column prototype for a table.

This runs lazily the first time a column is constructed for a table.
Methods assigned here are shared by every column instance created by that
table, so this hook should be used for APIs and memoized methods rather
than per-column mutable data.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### prototype

`Record`\<`string`, `any`\>

##### table

[`Table_Internal`](Table_Internal.md)\<`TFeatures`, `TData`\>

#### Returns

`void`

***

### assignHeaderPrototype()?

```ts
optional assignHeaderPrototype: <TFeatures, TData>(prototype, table) => void;
```

Defined in: [types/TableFeatures.ts:358](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L358)

Adds feature methods to the shared header prototype for a table.

This runs lazily the first time a header is constructed for a table.
Methods assigned here are shared by every header instance created by that
table, so this hook should be used for APIs and memoized methods rather
than per-header mutable data.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### prototype

`Record`\<`string`, `any`\>

##### table

[`Table_Internal`](Table_Internal.md)\<`TFeatures`, `TData`\>

#### Returns

`void`

***

### assignRowPrototype()?

```ts
optional assignRowPrototype: <TFeatures, TData>(prototype, table) => void;
```

Defined in: [types/TableFeatures.ts:373](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L373)

Adds feature methods to the shared row prototype for a table.

This runs lazily the first time a row is constructed for a table. Methods
assigned here are shared by every row instance created by that table, so
this hook should be used for APIs and memoized methods rather than per-row
mutable data.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### prototype

`Record`\<`string`, `any`\>

##### table

[`Table_Internal`](Table_Internal.md)\<`TFeatures`, `TData`\>

#### Returns

`void`

***

### constructTableAPIs()?

```ts
optional constructTableAPIs: <TFeatures, TData>(table) => void;
```

Defined in: [types/TableFeatures.ts:386](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L386)

Adds feature APIs directly to the table instance.

The table is a singleton, unlike rows, columns, headers, and cells, so
table APIs are assigned directly instead of through a shared prototype.
This hook is exclusively for assigning table methods. It runs after
options, state atoms, and the store have been created and after every
feature's `initTableInstanceData` hook has completed.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### table

[`Table_Internal`](Table_Internal.md)\<`TFeatures`, `TData`\>

#### Returns

`void`

***

### getDefaultColumnDef()?

```ts
optional getDefaultColumnDef: <TFeatures, TData, TValue>() => ColumnDefBase_All<TFeatures, TData, TValue>;
```

Defined in: [types/TableFeatures.ts:396](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L396)

Returns default column definition options contributed by this feature.

These defaults are merged into the table's default column definition before
`options.defaultColumn` and before each user-supplied column definition is
resolved, so users can override values supplied here.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Returns

[`ColumnDefBase_All`](../type-aliases/ColumnDefBase_All.md)\<`TFeatures`, `TData`, `TValue`\>

***

### getDefaultTableOptions()?

```ts
optional getDefaultTableOptions: <TFeatures, TData>(table) => Partial<TableOptions_All<TFeatures, TData>>;
```

Defined in: [types/TableFeatures.ts:409](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L409)

Returns default table options contributed by this feature.

This runs while table options are being resolved. Use it for option
defaults such as feature enablement flags and default state-updater
callbacks. User-supplied table options take precedence over values returned
here.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### table

[`Table_Internal`](Table_Internal.md)\<`TFeatures`, `TData`\>

#### Returns

`Partial`\<[`TableOptions_All`](../type-aliases/TableOptions_All.md)\<`TFeatures`, `TData`\>\>

***

### getInitialState()?

```ts
optional getInitialState: (initialState) => TableState_All;
```

Defined in: [types/TableFeatures.ts:423](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L423)

Returns this feature's initial table state.

The incoming `initialState` contains state accumulated from earlier
features and user-provided initial state. Return a complete state object
for this feature, preserving `initialState` so user-provided values can
override feature defaults.

#### Parameters

##### initialState

`Partial`\<[`TableState_All`](TableState_All.md)\>

#### Returns

[`TableState_All`](TableState_All.md)

***

### initCellInstanceData()?

```ts
optional initCellInstanceData: <TFeatures, TData, TValue>(cell) => void;
```

Defined in: [types/TableFeatures.ts:449](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L449)

Initializes instance-specific data on each cell.

This runs for every constructed cell after core cell fields such as `id`,
`column`, and `row` have been assigned. Cells are constructed lazily on
first access per row/column pair and cached, so this runs once per cell
instance. Use this for per-cell mutable data, caches, or annotations.
Shared methods should be assigned via `assignCellPrototype` instead.

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

***

### initColumnInstanceData()?

```ts
optional initColumnInstanceData: <TFeatures, TData, TValue>(column) => void;
```

Defined in: [types/TableFeatures.ts:464](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L464)

Initializes instance-specific data on each column.

This runs for every constructed column after core column fields such as
`id`, `depth`, `parent`, `columnDef`, and `columns` have been assigned.
Use this for per-column mutable data, caches, or annotations. Shared
methods should be assigned via `assignColumnPrototype` instead.

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

***

### initHeaderGroupInstanceData()?

```ts
optional initHeaderGroupInstanceData: <TFeatures, TData>(headerGroup) => void;
```

Defined in: [types/TableFeatures.ts:480](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L480)

Initializes instance-specific data on each header group.

This runs for every constructed header group after `depth`, `id`, and the
fully populated `headers` array have been assigned. Header groups have no
shared prototype, so this is their only per-instance extension point.
Header groups are reconstructed whenever they recompute (e.g. column
visibility, order, or pinning changes), so this reruns on every rebuild.

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

***

### initHeaderInstanceData()?

```ts
optional initHeaderInstanceData: <TFeatures, TData, TValue>(header) => void;
```

Defined in: [types/TableFeatures.ts:497](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L497)

Initializes instance-specific data on each header.

This runs for every constructed header after core header fields such as
`id`, `column`, `depth`, `index`, and `isPlaceholder` have been assigned,
but before `subHeaders` are populated and before `headerGroup` is linked.
Headers are reconstructed on every header group rebuild, so this reruns
on every rebuild. Use this for per-header mutable data, caches, or
annotations. Shared methods should be assigned via `assignHeaderPrototype`
instead.

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

***

### initRowInstanceData()?

```ts
optional initRowInstanceData: <TFeatures, TData>(row) => void;
```

Defined in: [types/TableFeatures.ts:512](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L512)

Initializes instance-specific data on each row.

This runs for every constructed row after core row fields such as `id`,
`index`, `depth`, `original`, `parentId`, and `subRows` have been assigned.
Use this for per-row mutable data, caches, or annotations. Shared methods
should be assigned via `assignRowPrototype` instead.

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

***

### initTableInstanceData()?

```ts
optional initTableInstanceData: <TFeatures, TData>(table) => void;
```

Defined in: [types/TableFeatures.ts:434](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L434)

Initializes mutable, non-reactive data owned by this feature on the table
instance.

This runs once during table construction after options, state atoms, and
the store are available, and before any feature's `constructTableAPIs`
hook runs. Use `constructTableAPIs` exclusively for assigning table
methods. Table resets do not rerun this hook; use
`resetTableInstanceData` to clear transient instance data instead.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### table

[`Table_Internal`](Table_Internal.md)\<`TFeatures`, `TData`\>

#### Returns

`void`

***

### resetTableInstanceData()?

```ts
optional resetTableInstanceData: <TFeatures, TData>(table) => void;
```

Defined in: [types/TableFeatures.ts:525](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L525)

Resets mutable, non-reactive table-instance data owned by this feature.

This runs after internally owned state atoms have been restored to
`table.initialState` by `table.reset()`. It is intended for transient
feature data, not table state slices or externally controlled state.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### table

[`Table_Internal`](Table_Internal.md)\<`TFeatures`, `TData`\>

#### Returns

`void`

---
id: TableOptions_Table
title: TableOptions_Table
---

# Interface: TableOptions\_Table\<TFeatures, TData\>

## Extended by

- [`TableOptions_Core`](tableoptions_core.md)

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

#### Defined in

[core/table/Tables.types.ts:43](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L43)

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

#### Defined in

[core/table/Tables.types.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L55)

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

#### Defined in

[core/table/Tables.types.ts:61](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L61)

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

#### Defined in

[core/table/Tables.types.ts:91](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L91)

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

#### Defined in

[core/table/Tables.types.ts:98](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L98)

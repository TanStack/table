---
id: TableOptions_Table
title: TableOptions_Table
---

# Interface: TableOptions\_Table\<TFeatures, TData\>

Defined in: [core/table/coreTablesFeature.types.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L62)

## Extended by

- [`TableOptions_Core`](TableOptions_Core.md)

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

***

### \_rowModels?

```ts
optional _rowModels: CreateRowModels_All<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:73](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L73)

The row model options that you want to enable for the table.

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

***

### autoResetAll?

```ts
optional autoResetAll: boolean;
```

Defined in: [core/table/coreTablesFeature.types.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L85)

Set this option to override any of the `autoReset...` feature options.

***

### data

```ts
data: readonly TData[];
```

Defined in: [core/table/coreTablesFeature.types.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L89)

The data for the table to display. When the `data` option changes reference, the table will reprocess the data.

***

### initialState?

```ts
optional initialState: Partial<TableState<TFeatures>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:94](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L94)

Use this option to optionally pass initial state to the table. This state will be used when resetting various table states either automatically by the table (eg. `options.autoResetPageIndex`) or via functions like `table.resetRowSelection()`. Most reset function allow you optionally pass a flag to reset to a blank/default state instead of the initial state.
Table state will not be reset when this object changes, which also means that the initial state object does not need to be stable.

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

***

### meta?

```ts
optional meta: TableMeta<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:105](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L105)

You can pass any object to `options.meta` and access it anywhere the `table` is available via `table.options.meta`.

***

### state?

```ts
optional state: Partial<TableState<TFeatures>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:109](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L109)

Pass in individual self-managed state to the table.

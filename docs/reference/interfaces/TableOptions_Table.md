---
id: TableOptions_Table
title: TableOptions_Table
---

# Interface: TableOptions\_Table\<TFeatures, TData\>

Defined in: [core/table/coreTablesFeature.types.ts:64](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L64)

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
readonly _features: TFeatures;
```

Defined in: [core/table/coreTablesFeature.types.ts:71](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L71)

The features that you want to enable for the table.

***

### \_rowModels?

```ts
readonly optional _rowModels: CreateRowModels_All<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L75)

The row model options that you want to enable for the table.

***

### atoms?

```ts
readonly optional atoms: Partial<{ [K in string | number | symbol]: Atom<TableState<TFeatures>[K]> }>;
```

Defined in: [core/table/coreTablesFeature.types.ts:83](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L83)

Optionally, provide your own external writable atoms for individual state slices.
When an atom is provided for a given slice, it takes precedence over `options.state[key]`
and the internal base atom for that slice. Writes originating from the library are
still routed through the internal base atom; consumers are responsible for
mirroring changes back to their external atom via the corresponding `onXChange` callback.

***

### autoResetAll?

```ts
readonly optional autoResetAll: boolean;
```

Defined in: [core/table/coreTablesFeature.types.ts:87](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L87)

Set this option to override any of the `autoReset...` feature options.

***

### data

```ts
readonly data: readonly TData[];
```

Defined in: [core/table/coreTablesFeature.types.ts:91](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L91)

The data for the table to display. When the `data` option changes reference, the table will reprocess the data.

***

### initialState?

```ts
readonly optional initialState: Partial<TableState<TFeatures>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:96](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L96)

Use this option to optionally pass initial state to the table. This state will be used when resetting various table states either automatically by the table (eg. `options.autoResetPageIndex`) or via functions like `table.resetRowSelection()`. Most reset function allow you optionally pass a flag to reset to a blank/default state instead of the initial state.
Table state will not be reset when this object changes, which also means that the initial state object does not need to be stable.

***

### mergeOptions()?

```ts
readonly optional mergeOptions: (defaultOptions, options) => TableOptions<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:100](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L100)

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
readonly optional meta: TableMeta<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:107](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L107)

You can pass any object to `options.meta` and access it anywhere the `table` is available via `table.options.meta`.

***

### state?

```ts
readonly optional state: Partial<TableState<TFeatures>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:111](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L111)

Pass in individual self-managed state to the table.

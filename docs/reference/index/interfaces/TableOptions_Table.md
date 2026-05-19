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

Defined in: [core/table/coreTablesFeature.types.ts:74](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L74)

The feature modules registered on this table instance.

Feature registration controls which state slices, options, and prototype
APIs are available.

***

### \_rowModels?

```ts
readonly optional _rowModels: CreateRowModels_All<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:79](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L79)

Row model factories used by features such as filtering, grouping, sorting,
expansion, and pagination.

***

### atoms?

```ts
readonly optional atoms: Partial<{ [K in string | number | symbol]: Atom<TableState<TFeatures>[K]> }>;
```

Defined in: [core/table/coreTablesFeature.types.ts:87](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L87)

Optionally, provide your own external writable atoms for individual state slices.
When an atom is provided for a given slice, it takes precedence over `options.state[key]`
and the internal base atom for that slice. Feature state update APIs write through
the corresponding atom updater, so external atoms are the preferred v9 ownership
model for app-managed table state slices.

***

### autoResetAll?

```ts
readonly optional autoResetAll: boolean;
```

Defined in: [core/table/coreTablesFeature.types.ts:91](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L91)

Set this option to override any of the `autoReset...` feature options.

***

### data

```ts
readonly data: readonly TData[];
```

Defined in: [core/table/coreTablesFeature.types.ts:95](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L95)

The data for the table to display. When the `data` option changes reference, the table will reprocess the data.

***

### initialState?

```ts
readonly optional initialState: Partial<TableState<TFeatures>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:102](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L102)

Optionally provide starting values for registered table state slices.
Feature reset APIs use this value by default, and many reset APIs accept
`true` to reset to that feature's blank/default state instead. Changing this
object later does not reset table state, so it does not need to be stable.

***

### mergeOptions()?

```ts
readonly optional mergeOptions: (defaultOptions, options) => TableOptions<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:106](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L106)

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

Defined in: [core/table/coreTablesFeature.types.ts:113](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L113)

You can pass any object to `options.meta` and access it anywhere the `table` is available via `table.options.meta`.

***

### state?

```ts
readonly optional state: Partial<TableState<TFeatures>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:121](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L121)

Optionally provide externally managed values for individual state slices.

Pair each slice with its matching `on[State]Change` callback so table state
updates can be persisted outside the table. External atoms take precedence
over this option when both are provided for the same slice.

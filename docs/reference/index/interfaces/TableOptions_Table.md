---
id: TableOptions_Table
title: TableOptions_Table
---

# Interface: TableOptions\_Table\<TFeatures, TData\>

Defined in: [core/table/coreTablesFeature.types.ts:86](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L86)

## Extended by

- [`TableOptions_Core`](TableOptions_Core.md)

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

***

### autoResetAll?

```ts
readonly optional autoResetAll: boolean;
```

Defined in: [core/table/coreTablesFeature.types.ts:111](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L111)

Set this option to override any of the `autoReset...` feature options.

***

### data

```ts
readonly data: readonly TData[];
```

Defined in: [core/table/coreTablesFeature.types.ts:115](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L115)

The data for the table to display. When the `data` option changes reference, the table will reprocess the data.

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

***

### key?

```ts
readonly optional key: string;
```

Defined in: [core/table/coreTablesFeature.types.ts:122](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L122)

Optional key used to identify this table instance.

This is used by TanStack Table Devtools to register and select tables. It is
not required unless the table is passed to devtools.

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

***

### meta?

```ts
readonly optional meta: ExtractTableMeta<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:143](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L143)

You can pass any object to `options.meta` and access it anywhere the `table` is available via `table.options.meta`.

Declare its type per-table via the `tableMeta` type-only slot on the
`features` option, or globally via declaration merging on `TableMeta`.

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

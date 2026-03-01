---
id: TableOptions_Table
title: TableOptions_Table
---

# Interface: TableOptions\_Table\<TFeatures, TData\>

Defined in: [core/table/coreTablesFeature.types.ts:15](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L15)

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

Defined in: [core/table/coreTablesFeature.types.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L22)

The features that you want to enable for the table.

***

### \_rowModels?

```ts
optional _rowModels: CreateRowModels_All<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:26](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L26)

The row model options that you want to enable for the table.

***

### autoResetAll?

```ts
optional autoResetAll: boolean;
```

Defined in: [core/table/coreTablesFeature.types.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L30)

Set this option to override any of the `autoReset...` feature options.

***

### data

```ts
data: readonly TData[];
```

Defined in: [core/table/coreTablesFeature.types.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L34)

The data for the table to display. When the `data` option changes reference, the table will reprocess the data.

***

### initialState?

```ts
optional initialState: Partial<TableState<TFeatures>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:39](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L39)

Use this option to optionally pass initial state to the table. This state will be used when resetting various table states either automatically by the table (eg. `options.autoResetPageIndex`) or via functions like `table.resetRowSelection()`. Most reset function allow you optionally pass a flag to reset to a blank/default state instead of the initial state.
Table state will not be reset when this object changes, which also means that the initial state object does not need to be stable.

***

### mergeOptions()?

```ts
optional mergeOptions: (defaultOptions, options) => TableOptions<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:43](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L43)

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

Defined in: [core/table/coreTablesFeature.types.ts:50](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L50)

You can pass any object to `options.meta` and access it anywhere the `table` is available via `table.options.meta`.

***

### state?

```ts
optional state: Partial<TableState<TFeatures>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:54](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L54)

Pass in individual self-managed state to the table.

***

### store?

```ts
optional store: Store<TableState<TFeatures>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L58)

Optionally, provide your own external TanStack Store instance if you want to manage the table state externally.

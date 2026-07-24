---
id: Table_Table
title: Table_Table
---

# Interface: Table\_Table\<TFeatures, TData\>

Defined in: [core/table/coreTablesFeature.types.ts:252](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L252)

## Extends

- [`Table_CoreProperties`](Table_CoreProperties.md)\<`TFeatures`, `TData`\>

## Extended by

- [`Table_Core`](Table_Core.md)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### \_cellInstanceInitFns?

```ts
optional _cellInstanceInitFns: <TFeatures, TData, TValue>(cell) => void[];
```

Defined in: [core/table/coreTablesFeature.types.ts:167](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L167)

Cache of the `initCellInstanceData` functions for features that define one.

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

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_cellInstanceInitFns`](Table_CoreProperties.md#_cellinstanceinitfns)

***

### \_cellPrototype?

```ts
optional _cellPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:173](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L173)

Prototype cache for Cell objects - shared by all cells in this table

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_cellPrototype`](Table_CoreProperties.md#_cellprototype)

***

### \_columnInstanceInitFns?

```ts
optional _columnInstanceInitFns: <TFeatures, TData, TValue>(column) => void[];
```

Defined in: [core/table/coreTablesFeature.types.ts:177](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L177)

Cache of the `initColumnInstanceData` functions for features that define one.

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

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_columnInstanceInitFns`](Table_CoreProperties.md#_columninstanceinitfns)

***

### \_columnPrototype?

```ts
optional _columnPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:183](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L183)

Prototype cache for Column objects - shared by all columns in this table

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_columnPrototype`](Table_CoreProperties.md#_columnprototype)

***

### \_features

```ts
readonly _features: Partial<CoreFeatures> & TFeatures;
```

Defined in: [core/table/coreTablesFeature.types.ts:187](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L187)

The features that are enabled for the table.

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_features`](Table_CoreProperties.md#_features)

***

### \_headerGroupInstanceInitFns?

```ts
optional _headerGroupInstanceInitFns: <TFeatures, TData>(headerGroup) => void[];
```

Defined in: [core/table/coreTablesFeature.types.ts:191](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L191)

Cache of the `initHeaderGroupInstanceData` functions for features that define one.

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

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_headerGroupInstanceInitFns`](Table_CoreProperties.md#_headergroupinstanceinitfns)

***

### \_headerInstanceInitFns?

```ts
optional _headerInstanceInitFns: <TFeatures, TData, TValue>(header) => void[];
```

Defined in: [core/table/coreTablesFeature.types.ts:197](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L197)

Cache of the `initHeaderInstanceData` functions for features that define one.

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

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_headerInstanceInitFns`](Table_CoreProperties.md#_headerinstanceinitfns)

***

### \_headerPrototype?

```ts
optional _headerPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:203](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L203)

Prototype cache for Header objects - shared by all headers in this table

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_headerPrototype`](Table_CoreProperties.md#_headerprototype)

***

### \_reactivity

```ts
readonly _reactivity: TableReactivityBindings;
```

Defined in: [core/table/coreTablesFeature.types.ts:163](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L163)

Table reactivity bindings for interacting with TanStack Store.

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_reactivity`](Table_CoreProperties.md#_reactivity)

***

### \_rowInstanceInitFns?

```ts
optional _rowInstanceInitFns: <TFeatures, TData>(row) => void[];
```

Defined in: [core/table/coreTablesFeature.types.ts:219](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L219)

Cache of the `initRowInstanceData` functions for features that define one.

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

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_rowInstanceInitFns`](Table_CoreProperties.md#_rowinstanceinitfns)

***

### \_rowModelFns

```ts
readonly _rowModelFns: RowModelFns<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:207](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L207)

The row model processing functions that are used to process the data by features.

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_rowModelFns`](Table_CoreProperties.md#_rowmodelfns)

***

### \_rowModels

```ts
readonly _rowModels: CachedRowModels<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:211](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L211)

The row models that are enabled for the table.

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_rowModels`](Table_CoreProperties.md#_rowmodels)

***

### \_rowPrototype?

```ts
optional _rowPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:215](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L215)

Prototype cache for Row objects - shared by all rows in this table

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_rowPrototype`](Table_CoreProperties.md#_rowprototype)

***

### atoms

```ts
readonly atoms: Atoms<TFeatures>;
```

Defined in: [core/table/coreTablesFeature.types.ts:225](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L225)

The readonly derived atoms for each `TableState` slice. Each derives from
its corresponding `baseAtom` plus, optionally, a per-slice external atom or
external state value (precedence: external atom > external state > base atom).

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`atoms`](Table_CoreProperties.md#atoms)

***

### baseAtoms

```ts
readonly baseAtoms: BaseAtoms<TFeatures>;
```

Defined in: [core/table/coreTablesFeature.types.ts:230](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L230)

The internal writable atoms for each `TableState` slice. This is the library's
single write surface — all state mutations from features land here.

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`baseAtoms`](Table_CoreProperties.md#baseatoms)

***

### initialState

```ts
readonly initialState: ExtractFeatureMapTypes<TFeatures>;
```

Defined in: [core/table/coreTablesFeature.types.ts:234](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L234)

This is the resolved initial state of the table.

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`initialState`](Table_CoreProperties.md#initialstate)

***

### options

```ts
readonly options: TableOptions<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:238](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L238)

A read-only reference to the table's current options.

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`options`](Table_CoreProperties.md#options)

***

### optionsStore?

```ts
readonly optional optionsStore: Atom<TableOptions<TFeatures, TData>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:244](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L244)

Writable atom for table options. Only created when `createOptionsStore` is
true on the active core reactivity bindings. Adapters that opt out keep
options as plain resolved data instead of backing them with an atom.

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`optionsStore`](Table_CoreProperties.md#optionsstore)

***

### reset()

```ts
reset: () => void;
```

Defined in: [core/table/coreTablesFeature.types.ts:264](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L264)

Resets the table's internal base atoms to `table.initialState`.

Prefer feature-specific reset APIs, such as `resetPagination`, when a state
slice may be owned by an external atom or needs that feature's blank/default
reset behavior. After resetting internal atoms, this also invokes feature
reset hooks for mutable, transient table-instance data.

#### Returns

`void`

***

### setOptions()

```ts
setOptions: (newOptions) => void;
```

Defined in: [core/table/coreTablesFeature.types.ts:269](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L269)

Updates the table options by applying a value or updater to the current
resolved options and then merging them through `options.mergeOptions`.

#### Parameters

##### newOptions

[`Updater`](../type-aliases/Updater.md)\<[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>\>

#### Returns

`void`

***

### store

```ts
readonly store: ReadonlyStore<ExtractFeatureMapTypes<TFeatures, TableState_FeatureMap>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:249](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L249)

The readonly flat store for the table state. Derives from `table.atoms`
only; never reads external state directly.

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`store`](Table_CoreProperties.md#store)

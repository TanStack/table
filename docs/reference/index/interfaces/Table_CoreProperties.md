---
id: Table_CoreProperties
title: Table_CoreProperties
---

# Interface: Table\_CoreProperties\<TFeatures, TData\>

Defined in: [core/table/coreTablesFeature.types.ts:156](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L156)

## Extended by

- [`Table_Table`](Table_Table.md)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### \_cellInstanceInitFns

```ts
_cellInstanceInitFns: <TFeatures, TData, TValue>(cell) => void[];
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

***

### \_cellPrototype?

```ts
optional _cellPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:171](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L171)

Prototype cache for Cell objects - shared by all cells in this table

***

### \_columnInstanceInitFns

```ts
_columnInstanceInitFns: <TFeatures, TData, TValue>(column) => void[];
```

Defined in: [core/table/coreTablesFeature.types.ts:175](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L175)

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

***

### \_columnPrototype?

```ts
optional _columnPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:181](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L181)

Prototype cache for Column objects - shared by all columns in this table

***

### \_features

```ts
readonly _features: Partial<CoreFeatures> & TFeatures;
```

Defined in: [core/table/coreTablesFeature.types.ts:185](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L185)

The features that are enabled for the table.

***

### \_headerGroupInstanceInitFns

```ts
_headerGroupInstanceInitFns: <TFeatures, TData>(headerGroup) => void[];
```

Defined in: [core/table/coreTablesFeature.types.ts:189](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L189)

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

***

### \_headerInstanceInitFns

```ts
_headerInstanceInitFns: <TFeatures, TData, TValue>(header) => void[];
```

Defined in: [core/table/coreTablesFeature.types.ts:195](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L195)

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

***

### \_headerPrototype?

```ts
optional _headerPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:201](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L201)

Prototype cache for Header objects - shared by all headers in this table

***

### \_reactivity

```ts
readonly _reactivity: TableReactivityBindings;
```

Defined in: [core/table/coreTablesFeature.types.ts:163](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L163)

Table reactivity bindings for interacting with TanStack Store.

***

### \_rowInstanceInitFns

```ts
_rowInstanceInitFns: <TFeatures, TData>(row) => void[];
```

Defined in: [core/table/coreTablesFeature.types.ts:217](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L217)

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

***

### \_rowModelFns

```ts
readonly _rowModelFns: RowModelFns<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:205](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L205)

The row model processing functions that are used to process the data by features.

***

### \_rowModels

```ts
readonly _rowModels: CachedRowModels<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:209](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L209)

The row models that are enabled for the table.

***

### \_rowPrototype?

```ts
optional _rowPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:213](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L213)

Prototype cache for Row objects - shared by all rows in this table

***

### atoms

```ts
readonly atoms: Atoms<TFeatures>;
```

Defined in: [core/table/coreTablesFeature.types.ts:223](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L223)

The readonly derived atoms for each `TableState` slice. Each derives from
its corresponding `baseAtom` plus, optionally, a per-slice external atom or
external state value (precedence: external atom > external state > base atom).

***

### baseAtoms

```ts
readonly baseAtoms: BaseAtoms<TFeatures>;
```

Defined in: [core/table/coreTablesFeature.types.ts:228](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L228)

The internal writable atoms for each `TableState` slice. This is the library's
single write surface — all state mutations from features land here.

***

### initialState

```ts
readonly initialState: ExtractFeatureMapTypes<TFeatures>;
```

Defined in: [core/table/coreTablesFeature.types.ts:232](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L232)

This is the resolved initial state of the table.

***

### options

```ts
readonly options: TableOptions<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:236](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L236)

A read-only reference to the table's current options.

***

### optionsStore?

```ts
readonly optional optionsStore: Atom<TableOptions<TFeatures, TData>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:242](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L242)

Writable atom for table options. Only created when `createOptionsStore` is
true on the active core reactivity bindings. Adapters that opt out keep
options as plain resolved data instead of backing them with an atom.

***

### store

```ts
readonly store: ReadonlyStore<ExtractFeatureMapTypes<TFeatures, TableState_FeatureMap>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:247](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L247)

The readonly flat store for the table state. Derives from `table.atoms`
only; never reads external state directly.

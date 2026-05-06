---
id: Table_CoreProperties
title: Table_CoreProperties
---

# Interface: Table\_CoreProperties\<TFeatures, TData\>

Defined in: [core/table/coreTablesFeature.types.ts:114](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L114)

## Extended by

- [`Table_Table`](Table_Table.md)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### \_cellPrototype?

```ts
optional _cellPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:125](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L125)

Prototype cache for Cell objects - shared by all cells in this table

***

### \_columnPrototype?

```ts
optional _columnPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:129](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L129)

Prototype cache for Column objects - shared by all columns in this table

***

### \_features

```ts
readonly _features: Partial<CoreFeatures> & TFeatures;
```

Defined in: [core/table/coreTablesFeature.types.ts:133](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L133)

The features that are enabled for the table.

***

### \_headerPrototype?

```ts
optional _headerPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:137](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L137)

Prototype cache for Header objects - shared by all headers in this table

***

### \_reactivity

```ts
readonly _reactivity: TableReactivityBindings;
```

Defined in: [core/table/coreTablesFeature.types.ts:121](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L121)

Table reactivity bindings for interacting with TanStack Store.

***

### \_rowModelFns

```ts
readonly _rowModelFns: RowModelFns<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:141](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L141)

The row model processing functions that are used to process the data by features.

***

### \_rowModels

```ts
readonly _rowModels: CachedRowModels<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:145](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L145)

The row models that are enabled for the table.

***

### \_rowPrototype?

```ts
optional _rowPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:149](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L149)

Prototype cache for Row objects - shared by all rows in this table

***

### atoms

```ts
readonly atoms: Atoms<TFeatures>;
```

Defined in: [core/table/coreTablesFeature.types.ts:155](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L155)

The readonly derived atoms for each `TableState` slice. Each derives from
its corresponding `baseAtom` plus, optionally, a per-slice external atom or
external state value (precedence: external atom > external state > base atom).

***

### baseAtoms

```ts
readonly baseAtoms: BaseAtoms<TFeatures>;
```

Defined in: [core/table/coreTablesFeature.types.ts:160](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L160)

The internal writable atoms for each `TableState` slice. This is the library's
single write surface — all state mutations from features land here.

***

### initialState

```ts
readonly initialState: TableState<TFeatures>;
```

Defined in: [core/table/coreTablesFeature.types.ts:164](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L164)

This is the resolved initial state of the table.

***

### options

```ts
readonly options: TableOptions<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:168](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L168)

A read-only reference to the table's current options.

***

### optionsStore?

```ts
readonly optional optionsStore: Atom<TableOptions<TFeatures, TData>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:175](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L175)

Writable atom for table options. Only created when `createOptionsStore` is true
on `coreReativityFeature` (e.g. Lit, Vue, Solid). React/Preact use `createOptionsStore: false`:
options are held as plain data with a lightweight revision + subscribe source; there is
no writable atom backing the full options object. Use getTableOptionsStore to subscribe.

***

### store

```ts
readonly store: ReadonlyStore<TableState<TFeatures>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:180](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L180)

The readonly flat store for the table state. Derives from `table.atoms`
only; never reads external state directly.

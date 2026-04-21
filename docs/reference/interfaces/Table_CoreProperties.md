---
id: Table_CoreProperties
title: Table_CoreProperties
---

# Interface: Table\_CoreProperties\<TFeatures, TData\>

Defined in: [core/table/coreTablesFeature.types.ts:112](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L112)

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

Defined in: [core/table/coreTablesFeature.types.ts:123](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L123)

Prototype cache for Cell objects - shared by all cells in this table

***

### \_columnPrototype?

```ts
optional _columnPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:127](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L127)

Prototype cache for Column objects - shared by all columns in this table

***

### \_features

```ts
_features: Partial<CoreFeatures> & TFeatures;
```

Defined in: [core/table/coreTablesFeature.types.ts:119](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L119)

The features that are enabled for the table.

***

### \_headerPrototype?

```ts
optional _headerPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:131](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L131)

Prototype cache for Header objects - shared by all headers in this table

***

### \_rowModelFns

```ts
_rowModelFns: RowModelFns<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:135](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L135)

The row model processing functions that are used to process the data by features.

***

### \_rowModels

```ts
_rowModels: CachedRowModels<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:139](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L139)

The row models that are enabled for the table.

***

### \_rowPrototype?

```ts
optional _rowPrototype: object;
```

Defined in: [core/table/coreTablesFeature.types.ts:143](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L143)

Prototype cache for Row objects - shared by all rows in this table

***

### atoms

```ts
atoms: Atoms<TFeatures>;
```

Defined in: [core/table/coreTablesFeature.types.ts:154](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L154)

The readonly derived atoms for each `TableState` slice. Each derives from
its corresponding `baseAtom` plus, optionally, a per-slice external atom or
external state value (precedence: external atom > external state > base atom).

***

### baseAtoms

```ts
baseAtoms: BaseAtoms<TFeatures>;
```

Defined in: [core/table/coreTablesFeature.types.ts:148](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L148)

The internal writable atoms for each `TableState` slice. This is the library's
single write surface — all state mutations from features land here.

***

### initialState

```ts
initialState: TableState<TFeatures>;
```

Defined in: [core/table/coreTablesFeature.types.ts:162](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L162)

This is the resolved initial state of the table.

***

### options

```ts
readonly options: TableOptions<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:166](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L166)

A read-only reference to the table's current options.

***

### optionsStore

```ts
optionsStore: Store<TableOptions<TFeatures, TData>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:158](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L158)

The base store for the table options.

***

### store

```ts
store: ReadonlyStore<TableState<TFeatures>>;
```

Defined in: [core/table/coreTablesFeature.types.ts:171](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L171)

The readonly flat store for the table state. Derives from `table.atoms`
only; never reads external state directly.

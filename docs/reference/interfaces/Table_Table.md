---
id: Table_Table
title: Table_Table
---

# Interface: Table\_Table\<TFeatures, TData\>

Defined in: [packages/table-core/src/core/table/coreTablesFeature.types.ts:111](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L111)

## Extends

- [`Table_CoreProperties`](Table_CoreProperties.md)\<`TFeatures`, `TData`\>

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

Defined in: [packages/table-core/src/core/table/coreTablesFeature.types.ts:72](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L72)

Prototype cache for Cell objects - shared by all cells in this table

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_cellPrototype`](Table_CoreProperties.md#_cellprototype)

***

### \_columnPrototype?

```ts
optional _columnPrototype: object;
```

Defined in: [packages/table-core/src/core/table/coreTablesFeature.types.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L76)

Prototype cache for Column objects - shared by all columns in this table

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_columnPrototype`](Table_CoreProperties.md#_columnprototype)

***

### \_features

```ts
_features: Partial<CoreFeatures> & TFeatures;
```

Defined in: [packages/table-core/src/core/table/coreTablesFeature.types.ts:68](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L68)

The features that are enabled for the table.

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_features`](Table_CoreProperties.md#_features)

***

### \_headerPrototype?

```ts
optional _headerPrototype: object;
```

Defined in: [packages/table-core/src/core/table/coreTablesFeature.types.ts:80](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L80)

Prototype cache for Header objects - shared by all headers in this table

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_headerPrototype`](Table_CoreProperties.md#_headerprototype)

***

### \_rowModelFns

```ts
_rowModelFns: RowModelFns<TFeatures, TData>;
```

Defined in: [packages/table-core/src/core/table/coreTablesFeature.types.ts:84](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L84)

The row model processing functions that are used to process the data by features.

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_rowModelFns`](Table_CoreProperties.md#_rowmodelfns)

***

### \_rowModels

```ts
_rowModels: CachedRowModels<TFeatures, TData>;
```

Defined in: [packages/table-core/src/core/table/coreTablesFeature.types.ts:88](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L88)

The row models that are enabled for the table.

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_rowModels`](Table_CoreProperties.md#_rowmodels)

***

### \_rowPrototype?

```ts
optional _rowPrototype: object;
```

Defined in: [packages/table-core/src/core/table/coreTablesFeature.types.ts:92](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L92)

Prototype cache for Row objects - shared by all rows in this table

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`_rowPrototype`](Table_CoreProperties.md#_rowprototype)

***

### baseStore

```ts
baseStore: Store<TableState<TFeatures>>;
```

Defined in: [packages/table-core/src/core/table/coreTablesFeature.types.ts:96](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L96)

The base store for the table. This can be used to write to the table state.

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`baseStore`](Table_CoreProperties.md#basestore)

***

### initialState

```ts
initialState: TableState<TFeatures>;
```

Defined in: [packages/table-core/src/core/table/coreTablesFeature.types.ts:100](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L100)

This is the resolved initial state of the table.

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`initialState`](Table_CoreProperties.md#initialstate)

***

### options

```ts
options: TableOptions<TFeatures, TData>;
```

Defined in: [packages/table-core/src/core/table/coreTablesFeature.types.ts:104](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L104)

A read-only reference to the table's current options.

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`options`](Table_CoreProperties.md#options)

***

### reset()

```ts
reset: () => void;
```

Defined in: [packages/table-core/src/core/table/coreTablesFeature.types.ts:118](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L118)

Call this function to reset the table state to the initial state.

#### Returns

`void`

***

### setOptions()

```ts
setOptions: (newOptions) => void;
```

Defined in: [packages/table-core/src/core/table/coreTablesFeature.types.ts:122](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L122)

This function can be used to update the table options.

#### Parameters

##### newOptions

[`Updater`](../type-aliases/Updater.md)\<[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>\>

#### Returns

`void`

***

### store

```ts
store: Derived<TableState<TFeatures>, [Store<TableState<TFeatures>, (cb) => TableState>]>;
```

Defined in: [packages/table-core/src/core/table/coreTablesFeature.types.ts:108](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L108)

Where the table state is stored.

#### Inherited from

[`Table_CoreProperties`](Table_CoreProperties.md).[`store`](Table_CoreProperties.md#store)

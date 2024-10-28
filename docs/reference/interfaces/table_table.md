---
id: Table_Table
title: Table_Table
---

# Interface: Table\_Table\<TFeatures, TData\>

## Extends

- [`Table_CoreProperties`](table_coreproperties.md)\<`TFeatures`, `TData`\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### \_features

```ts
_features: Partial<Record<CoreTableFeatureName, TableFeature>> & TFeatures;
```

The features that are enabled for the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#_features)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`Table_CoreProperties`](table_coreproperties.md).[`_features`](Table_CoreProperties.md#_features)

#### Defined in

[core/table/Tables.types.ts:110](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L110)

***

### \_processingFns

```ts
_processingFns: ProcessingFns<TFeatures, TData>;
```

The processing functions that are used to process the data by features.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#_processingFns)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`Table_CoreProperties`](table_coreproperties.md).[`_processingFns`](Table_CoreProperties.md#_processingfns)

#### Defined in

[core/table/Tables.types.ts:116](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L116)

***

### \_rowModels

```ts
_rowModels: CachedRowModels<TFeatures, TData>;
```

The row models that are enabled for the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#_rowmodels)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`Table_CoreProperties`](table_coreproperties.md).[`_rowModels`](Table_CoreProperties.md#_rowmodels)

#### Defined in

[core/table/Tables.types.ts:122](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L122)

***

### getState()

```ts
getState: () => TableState<TFeatures>;
```

Call this function to get the table's current state. It's recommended to use this function and its state, especially when managing the table state manually. It is the exact same state used internally by the table for every feature and function it provides.

#### Returns

[`TableState`](../type-aliases/tablestate.md)\<`TFeatures`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#getstate)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Defined in

[core/table/Tables.types.ts:146](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L146)

***

### initialState

```ts
initialState: TableState<TFeatures>;
```

This is the resolved initial state of the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#initialstate)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`Table_CoreProperties`](table_coreproperties.md).[`initialState`](Table_CoreProperties.md#initialstate)

#### Defined in

[core/table/Tables.types.ts:128](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L128)

***

### options

```ts
options: TableOptions<TFeatures, TData>;
```

A read-only reference to the table's current options.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#options)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Inherited from

[`Table_CoreProperties`](table_coreproperties.md).[`options`](Table_CoreProperties.md#options)

#### Defined in

[core/table/Tables.types.ts:134](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L134)

***

### reset()

```ts
reset: () => void;
```

Call this function to reset the table state to the initial state.

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#reset)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Defined in

[core/table/Tables.types.ts:152](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L152)

***

### setOptions()

```ts
setOptions: (newOptions) => void;
```

This function can be used to update the table options.

#### Parameters

• **newOptions**: [`Updater`](../type-aliases/updater.md)\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>\>

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#setoptions)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Defined in

[core/table/Tables.types.ts:158](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L158)

***

### setState()

```ts
setState: (updater) => void;
```

Call this function to update the table state.

#### Parameters

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`TableState`](../type-aliases/tablestate.md)\<`TFeatures`\>\>

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#setstate)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Defined in

[core/table/Tables.types.ts:164](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L164)

---
id: Table_CoreProperties
title: Table_CoreProperties
---

# Interface: Table\_CoreProperties\<TFeatures, TData\>

## Extended by

- [`Table_Table`](table_table.md)

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

#### Defined in

[core/table/Tables.types.ts:122](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L122)

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

#### Defined in

[core/table/Tables.types.ts:134](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.types.ts#L134)

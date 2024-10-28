---
id: Table_Internal
title: Table_Internal
---

# Type Alias: Table\_Internal\<TFeatures, TData\>

```ts
type Table_Internal<TFeatures, TData>: Table<TFeatures, TData> & object;
```

## Type declaration

### \_processingFns

```ts
_processingFns: ProcessingFns_All<TFeatures, TData>;
```

### \_rowModels

```ts
_rowModels: CachedRowModel_All<TFeatures, TData>;
```

### options

```ts
options: TableOptions_All<TFeatures, TData> & object;
```

#### Type declaration

##### \_rowModels?

```ts
optional _rowModels: CreateRowModels_All<TFeatures, TData>;
```

##### initialState?

```ts
optional initialState: TableState_All;
```

##### state?

```ts
optional state: TableState_All;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Defined in

[types/Table.ts:88](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Table.ts#L88)

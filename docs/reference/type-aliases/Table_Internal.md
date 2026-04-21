---
id: Table_Internal
title: Table_Internal
---

# Type Alias: Table\_Internal\<TFeatures, TData\>

```ts
type Table_Internal<TFeatures, TData> = Table<TFeatures, TData> & object;
```

Defined in: [types/Table.ts:116](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Table.ts#L116)

## Type Declaration

### \_rowModelFns

```ts
_rowModelFns: RowModelFns_All<TFeatures, TData>;
```

### \_rowModels

```ts
_rowModels: CachedRowModel_All<TFeatures, TData>;
```

### atoms

```ts
atoms: Atoms_All;
```

### baseAtoms

```ts
baseAtoms: BaseAtoms_All;
```

### initialState

```ts
initialState: TableState_All;
```

### options

```ts
options: TableOptions_All<TFeatures, TData> & object;
```

#### Type Declaration

##### \_rowModels?

```ts
optional _rowModels: CreateRowModels_All<TFeatures, TData>;
```

##### atoms?

```ts
optional atoms: ExternalAtoms_All;
```

##### initialState?

```ts
optional initialState: TableState_All;
```

##### state?

```ts
optional state: TableState_All;
```

### store

```ts
store: ReadonlyStore<TableState_All>;
```

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md) = `any`

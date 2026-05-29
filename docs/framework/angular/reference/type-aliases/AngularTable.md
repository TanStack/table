---
id: AngularTable
title: AngularTable
---

# Type Alias: AngularTable\<TFeatures, TData\>

```ts
type AngularTable<TFeatures, TData> = Table<TFeatures, TData> & object;
```

Defined in: [packages/angular-table/src/injectTable.ts:33](https://github.com/TanStack/table/blob/main/packages/angular-table/src/injectTable.ts#L33)

## Type Declaration

### state

```ts
readonly state: Readonly<TableState<TFeatures>>;
```

The current table state exposed as a flat proxy. Prefer
`table.atoms.<slice>.get()` when reading a specific slice.

### ~~store~~

```ts
readonly store: Table<TFeatures, TData>["store"];
```

#### Deprecated

Prefer `table.atoms.<slice>.get()` for template/render reads
of a specific state slice, `table.state` for full-state debug snapshots, or
Angular computed values around explicit selectors. `table.store.state` is a
current-value snapshot and is easy to misuse in render code.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

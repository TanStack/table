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

The current table state exposed for template/render reads.

### ~~store~~

```ts
readonly store: Table<TFeatures, TData>["store"];
```

#### Deprecated

Prefer `table.state` for template/render reads,
`table.atoms.<slice>.get()` for slice snapshots, or Angular computed values
around explicit selectors. `table.state` is a current-value snapshot
and is easy to misuse in render code.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

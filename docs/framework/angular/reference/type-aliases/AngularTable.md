---
id: AngularTable
title: AngularTable
---

# Type Alias: AngularTable\<TFeatures, TData, TSelected\>

```ts
type AngularTable<TFeatures, TData, TSelected> = Table<TFeatures, TData> & object;
```

Defined in: [injectTable.ts:49](https://github.com/TanStack/table/blob/main/packages/angular-table/src/injectTable.ts#L49)

## Type Declaration

### computed

```ts
computed: AngularTableComputed<TFeatures>;
```

Alias: **`Subscribe`** — same function reference as `computed` (naming parity with other adapters).

### state

```ts
readonly state: Signal<Readonly<TSelected>>;
```

The selected state from the table store, based on the selector provided.

### Subscribe

```ts
Subscribe: AngularTableComputed<TFeatures>;
```

### value

```ts
readonly value: Signal<AngularTable<TFeatures, TData, TSelected>>;
```

A signal that returns the entire table instance. Will update on table/options change.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected` = `TableState`\<`TFeatures`\>

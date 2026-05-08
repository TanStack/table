---
id: AngularTable
title: AngularTable
---

# Type Alias: AngularTable\<TFeatures, TData, TSelected\>

```ts
type AngularTable<TFeatures, TData, TSelected> = Table<TFeatures, TData> & object;
```

Defined in: [injectTable.ts:57](https://github.com/TanStack/table/blob/main/packages/angular-table/src/injectTable.ts#L57)

## Type Declaration

### computed

```ts
computed: AngularTableComputed<TFeatures>;
```

Creates a computed that subscribe to changes in the table store with a custom selector.
Default equality function is "shallow".

### state

```ts
readonly state: Signal<Readonly<TSelected>>;
```

The selected state from the table store, based on the selector provided.

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

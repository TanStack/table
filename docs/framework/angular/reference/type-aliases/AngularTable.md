---
id: AngularTable
title: AngularTable
---

# Type Alias: AngularTable\<TFeatures, TData, TSelected\>

```ts
type AngularTable<TFeatures, TData, TSelected> = Table<TFeatures, TData> & object;
```

Defined in: [injectTable.ts:22](https://github.com/TanStack/table/blob/main/packages/angular-table/src/injectTable.ts#L22)

## Type Declaration

### state

```ts
readonly state: Signal<Readonly<TSelected>>;
```

The selected state from the table store, based on the selector provided.

### Subscribe()

```ts
Subscribe: <TSubSelected>(props) => Signal<Readonly<TSubSelected>>;
```

Subscribe to changes in the table store with a custom selector.

#### Type Parameters

##### TSubSelected

`TSubSelected` = \{
\}

#### Parameters

##### props

###### equal?

`ValueEqualityFn`\<`TSubSelected`\>

###### selector

(`state`) => `TSubSelected`

#### Returns

`Signal`\<`Readonly`\<`TSubSelected`\>\>

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected` = `TableState`\<`TFeatures`\>

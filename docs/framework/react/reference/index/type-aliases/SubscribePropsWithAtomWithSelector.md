---
id: SubscribePropsWithAtomWithSelector
title: SubscribePropsWithAtomWithSelector
---

# Type Alias: SubscribePropsWithAtomWithSelector\<TFeatures, TData, TAtomValue, TSelected\>

```ts
type SubscribePropsWithAtomWithSelector<TFeatures, TData, TAtomValue, TSelected> = object;
```

Defined in: [Subscribe.ts:54](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L54)

Subscribe to a projected value from a slice atom. The selector receives the
atom value; children receive the projected `TSelected`.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TAtomValue

`TAtomValue`

### TSelected

`TSelected`

## Properties

### atom

```ts
atom: Atom<TAtomValue> | ReadonlyAtom<TAtomValue>;
```

Defined in: [Subscribe.ts:61](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L61)

***

### children

```ts
children: (state) => ReactNode | ReactNode;
```

Defined in: [Subscribe.ts:63](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L63)

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [Subscribe.ts:62](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L62)

#### Parameters

##### state

`TAtomValue`

#### Returns

`TSelected`

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [Subscribe.ts:60](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L60)

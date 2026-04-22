---
id: SubscribePropsWithSourceWithSelector
title: SubscribePropsWithSourceWithSelector
---

# Type Alias: SubscribePropsWithSourceWithSelector\<TFeatures, TData, TSourceValue, TSelected\>

```ts
type SubscribePropsWithSourceWithSelector<TFeatures, TData, TSourceValue, TSelected> = object;
```

Defined in: [Subscribe.ts:54](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L54)

Subscribe to a projected value from a source (atom or store). The selector
receives the source value; children receive the projected `TSelected`.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSourceValue

`TSourceValue`

### TSelected

`TSelected`

## Properties

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

`TSourceValue`

#### Returns

`TSelected`

***

### source

```ts
source: Atom<TSourceValue> | ReadonlyAtom<TSourceValue>;
```

Defined in: [Subscribe.ts:61](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L61)

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [Subscribe.ts:60](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L60)

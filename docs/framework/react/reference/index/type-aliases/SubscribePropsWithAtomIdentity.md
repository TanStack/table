---
id: SubscribePropsWithAtomIdentity
title: SubscribePropsWithAtomIdentity
---

# Type Alias: SubscribePropsWithAtomIdentity\<TFeatures, TData, TAtomValue\>

```ts
type SubscribePropsWithAtomIdentity<TFeatures, TData, TAtomValue> = object;
```

Defined in: [Subscribe.ts:39](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L39)

Subscribe to the full value of a slice atom (e.g. `table.atoms.rowSelection`).
Omitting `selector` is equivalent to the identity selector — children receive
`TAtomValue`.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TAtomValue

`TAtomValue`

## Properties

### atom

```ts
atom: Atom<TAtomValue> | ReadonlyAtom<TAtomValue>;
```

Defined in: [Subscribe.ts:45](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L45)

***

### children

```ts
children: (state) => ReactNode | ReactNode;
```

Defined in: [Subscribe.ts:47](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L47)

***

### selector?

```ts
optional selector: undefined;
```

Defined in: [Subscribe.ts:46](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L46)

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [Subscribe.ts:44](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L44)

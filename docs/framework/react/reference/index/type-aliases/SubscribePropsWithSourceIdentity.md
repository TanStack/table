---
id: SubscribePropsWithSourceIdentity
title: SubscribePropsWithSourceIdentity
---

# Type Alias: SubscribePropsWithSourceIdentity\<TFeatures, TData, TSourceValue\>

```ts
type SubscribePropsWithSourceIdentity<TFeatures, TData, TSourceValue> = object;
```

Defined in: [Subscribe.ts:39](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L39)

Subscribe to the full value of a source (e.g. `table.atoms.rowSelection` or
`table.optionsStore`). Omitting `selector` is equivalent to the identity
selector — children receive `TSourceValue`.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSourceValue

`TSourceValue`

## Properties

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

### source

```ts
source: Atom<TSourceValue> | ReadonlyAtom<TSourceValue>;
```

Defined in: [Subscribe.ts:45](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L45)

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [Subscribe.ts:44](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L44)

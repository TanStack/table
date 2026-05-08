---
id: SubscribePropsWithSourceIdentity
title: SubscribePropsWithSourceIdentity
---

# Type Alias: SubscribePropsWithSourceIdentity\<TSourceValue\>

```ts
type SubscribePropsWithSourceIdentity<TSourceValue> = object;
```

Defined in: [Subscribe.ts:44](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L44)

Subscribe to the full value of a source (e.g. `table.atoms.rowSelection` or
`table.optionsStore`). Omitting `selector` is equivalent to the identity
selector — children receive `TSourceValue`.

## Type Parameters

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
source: SubscribeSource<TSourceValue>;
```

Defined in: [Subscribe.ts:45](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L45)

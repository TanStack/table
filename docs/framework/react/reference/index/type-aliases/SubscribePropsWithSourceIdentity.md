---
id: SubscribePropsWithSourceIdentity
title: SubscribePropsWithSourceIdentity
---

# Type Alias: SubscribePropsWithSourceIdentity\<TSourceValue\>

```ts
type SubscribePropsWithSourceIdentity<TSourceValue> = object;
```

Defined in: [react-table/src/Subscribe.ts:41](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L41)

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

Defined in: [react-table/src/Subscribe.ts:44](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L44)

***

### selector?

```ts
optional selector: undefined;
```

Defined in: [react-table/src/Subscribe.ts:43](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L43)

***

### source

```ts
source: SubscribeSource<TSourceValue>;
```

Defined in: [react-table/src/Subscribe.ts:42](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L42)

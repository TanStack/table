---
id: SubscribePropsWithSourceIdentity
title: SubscribePropsWithSourceIdentity
---

# Interface: SubscribePropsWithSourceIdentity\<TSourceValue\>

Defined in: [types.ts:134](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L134)

Subscribe to the full value of a source (e.g. `table.atoms.rowSelection` or
`table.optionsStore`). Omitting `selector` is equivalent to the identity
selector — children receive `TSourceValue`.

## Type Parameters

### TSourceValue

`TSourceValue`

## Properties

### children

```ts
children:
  | SubscribeStaticChild
  | (state) => unknown;
```

Defined in: [types.ts:137](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L137)

***

### selector?

```ts
optional selector: undefined;
```

Defined in: [types.ts:136](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L136)

***

### source

```ts
source: SubscribeSource<TSourceValue>;
```

Defined in: [types.ts:135](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L135)

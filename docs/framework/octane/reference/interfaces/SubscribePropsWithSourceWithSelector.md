---
id: SubscribePropsWithSourceWithSelector
title: SubscribePropsWithSourceWithSelector
---

# Interface: SubscribePropsWithSourceWithSelector\<TSourceValue, TSelected\>

Defined in: [types.ts:147](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L147)

Subscribe to a projected value from a source (atom or store). The selector
receives the source value; children receive the projected `TSelected`.

## Type Parameters

### TSourceValue

`TSourceValue`

### TSelected

`TSelected`

## Properties

### children

```ts
children:
  | SubscribeStaticChild
  | (state) => unknown;
```

Defined in: [types.ts:150](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L150)

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [types.ts:149](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L149)

#### Parameters

##### state

`TSourceValue`

#### Returns

`TSelected`

***

### source

```ts
source: SubscribeSource<TSourceValue>;
```

Defined in: [types.ts:148](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L148)

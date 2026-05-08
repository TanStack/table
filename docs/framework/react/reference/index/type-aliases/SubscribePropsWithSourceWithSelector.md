---
id: SubscribePropsWithSourceWithSelector
title: SubscribePropsWithSourceWithSelector
---

# Type Alias: SubscribePropsWithSourceWithSelector\<TSourceValue, TSelected\>

```ts
type SubscribePropsWithSourceWithSelector<TSourceValue, TSelected> = object;
```

Defined in: [Subscribe.ts:54](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L54)

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
children: (state) => ReactNode | ReactNode;
```

Defined in: [Subscribe.ts:57](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L57)

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [Subscribe.ts:56](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L56)

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

Defined in: [Subscribe.ts:55](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L55)

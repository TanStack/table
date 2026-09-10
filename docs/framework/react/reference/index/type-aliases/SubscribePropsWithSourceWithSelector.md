---
id: SubscribePropsWithSourceWithSelector
title: SubscribePropsWithSourceWithSelector
---

# Type Alias: SubscribePropsWithSourceWithSelector\<TSourceValue, TSelected\>

```ts
type SubscribePropsWithSourceWithSelector<TSourceValue, TSelected> = object;
```

Defined in: [react-table/src/Subscribe.ts:51](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L51)

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

Defined in: [react-table/src/Subscribe.ts:54](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L54)

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [react-table/src/Subscribe.ts:53](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L53)

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

Defined in: [react-table/src/Subscribe.ts:52](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L52)

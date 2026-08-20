---
id: SubscribePropsWithSourceWithSelector
title: SubscribePropsWithSourceWithSelector
---

# Type Alias: SubscribePropsWithSourceWithSelector\<TSourceValue, TSelected\>

```ts
type SubscribePropsWithSourceWithSelector<TSourceValue, TSelected> = object;
```

Defined in: [Subscribe.ts:48](https://github.com/TanStack/table/blob/main/packages/preact-table/src/Subscribe.ts#L48)

Subscribe to a projected value from a source (atom or store).

## Type Parameters

### TSourceValue

`TSourceValue`

### TSelected

`TSelected`

## Properties

### children

```ts
children: (state) => ComponentChildren | ComponentChildren;
```

Defined in: [Subscribe.ts:51](https://github.com/TanStack/table/blob/main/packages/preact-table/src/Subscribe.ts#L51)

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [Subscribe.ts:50](https://github.com/TanStack/table/blob/main/packages/preact-table/src/Subscribe.ts#L50)

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

Defined in: [Subscribe.ts:49](https://github.com/TanStack/table/blob/main/packages/preact-table/src/Subscribe.ts#L49)

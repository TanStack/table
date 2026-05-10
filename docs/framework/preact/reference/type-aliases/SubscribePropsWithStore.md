---
id: SubscribePropsWithStore
title: SubscribePropsWithStore
---

# Type Alias: SubscribePropsWithStore\<TFeatures, TSelected\>

```ts
type SubscribePropsWithStore<TFeatures, TSelected> = object;
```

Defined in: [Subscribe.ts:21](https://github.com/TanStack/table/blob/main/packages/preact-table/src/Subscribe.ts#L21)

Subscribe to `table.store` (full table state). The selector receives the full
TableState.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TSelected

`TSelected`

## Properties

### children

```ts
children: (state) => ComponentChildren | ComponentChildren;
```

Defined in: [Subscribe.ts:34](https://github.com/TanStack/table/blob/main/packages/preact-table/src/Subscribe.ts#L34)

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [Subscribe.ts:33](https://github.com/TanStack/table/blob/main/packages/preact-table/src/Subscribe.ts#L33)

Select from full table state. Re-renders when the selected value changes
(shallow compare).

Required in store mode so you never accidentally subscribe to the whole
store without an explicit projection.

#### Parameters

##### state

`TableState`\<`TFeatures`\>

#### Returns

`TSelected`

***

### source

```ts
source: SubscribeSource<TableState<TFeatures>>;
```

Defined in: [Subscribe.ts:25](https://github.com/TanStack/table/blob/main/packages/preact-table/src/Subscribe.ts#L25)

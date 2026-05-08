---
id: SubscribePropsWithStore
title: SubscribePropsWithStore
---

# Type Alias: SubscribePropsWithStore\<TFeatures, TSelected\>

```ts
type SubscribePropsWithStore<TFeatures, TSelected> = object;
```

Defined in: [Subscribe.ts:23](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L23)

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
children: (state) => ReactNode | ReactNode;
```

Defined in: [Subscribe.ts:36](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L36)

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [Subscribe.ts:35](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L35)

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

Defined in: [Subscribe.ts:27](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L27)

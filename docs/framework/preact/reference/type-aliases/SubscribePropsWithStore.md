---
id: SubscribePropsWithStore
title: SubscribePropsWithStore
---

# Type Alias: SubscribePropsWithStore\<TFeatures, TSelected\>

```ts
type SubscribePropsWithStore<TFeatures, TSelected> = object;
```

Defined in: [Subscribe.ts:18](https://github.com/TanStack/table/blob/main/packages/preact-table/src/Subscribe.ts#L18)

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

Defined in: [Subscribe.ts:31](https://github.com/TanStack/table/blob/main/packages/preact-table/src/Subscribe.ts#L31)

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [Subscribe.ts:30](https://github.com/TanStack/table/blob/main/packages/preact-table/src/Subscribe.ts#L30)

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

Defined in: [Subscribe.ts:22](https://github.com/TanStack/table/blob/main/packages/preact-table/src/Subscribe.ts#L22)

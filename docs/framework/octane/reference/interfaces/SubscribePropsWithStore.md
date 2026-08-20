---
id: SubscribePropsWithStore
title: SubscribePropsWithStore
---

# Interface: SubscribePropsWithStore\<TFeatures, TSelected\>

Defined in: [types.ts:113](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L113)

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
children:
  | SubscribeStaticChild
  | (state) => unknown;
```

Defined in: [types.ts:126](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L126)

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [types.ts:125](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L125)

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
source: SubscribeSource<ExtractFeatureMapTypes<TFeatures, TableState_FeatureMap>>;
```

Defined in: [types.ts:117](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L117)

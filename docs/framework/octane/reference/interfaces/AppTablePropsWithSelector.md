---
id: AppTablePropsWithSelector
title: AppTablePropsWithSelector
---

# Interface: AppTablePropsWithSelector\<TFeatures, TSelected\>

Defined in: [types.ts:598](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L598)

Props for AppTable component — with selector.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TSelected

`TSelected`

## Properties

### children()

```ts
children: (state) => unknown;
```

Defined in: [types.ts:602](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L602)

#### Parameters

##### state

`TSelected`

#### Returns

`unknown`

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [types.ts:603](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L603)

#### Parameters

##### state

`TableState`\<`TFeatures`\>

#### Returns

`TSelected`

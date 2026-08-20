---
id: AppTablePropsWithSelector
title: AppTablePropsWithSelector
---

# Interface: AppTablePropsWithSelector\<TFeatures, TSelected\>

Defined in: [types.ts:594](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L594)

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

Defined in: [types.ts:598](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L598)

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

Defined in: [types.ts:599](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L599)

#### Parameters

##### state

`TableState`\<`TFeatures`\>

#### Returns

`TSelected`

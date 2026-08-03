---
id: AppHeaderPropsWithSelector
title: AppHeaderPropsWithSelector
---

# Interface: AppHeaderPropsWithSelector\<TFeatures, TData, TValue, THeaderComponents, TSelected\>

Defined in: [types.ts:654](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L654)

Props for AppHeader/AppFooter component — with selector.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData`

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`TableComponentType`](../type-aliases/TableComponentType.md)\>

### TSelected

`TSelected`

## Properties

### children()

```ts
children: (header, state) => unknown;
```

Defined in: [types.ts:662](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L662)

#### Parameters

##### header

`Header_Core`\<`TFeatures`, `TData`, `TValue`\> & `ExtractFeatureMapTypes`\<`TFeatures`, `Header_FeatureMap`\> & `THeaderComponents` & `object`

##### state

`TSelected`

#### Returns

`unknown`

***

### header

```ts
header: Header<TFeatures, TData, TValue>;
```

Defined in: [types.ts:661](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L661)

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [types.ts:667](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L667)

#### Parameters

##### state

`TableState`\<`TFeatures`\>

#### Returns

`TSelected`

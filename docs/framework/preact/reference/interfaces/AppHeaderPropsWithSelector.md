---
id: AppHeaderPropsWithSelector
title: AppHeaderPropsWithSelector
---

# Interface: AppHeaderPropsWithSelector\<TFeatures, TData, TValue, THeaderComponents, TSelected\>

Defined in: [createTableHook.tsx:448](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L448)

Props for AppHeader/AppFooter component - with selector

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData`

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>

### TSelected

`TSelected`

## Properties

### children()

```ts
children: (header, state) => ComponentChildren;
```

Defined in: [createTableHook.tsx:456](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L456)

#### Parameters

##### header

`Header_Core`\<`TFeatures`, `TData`, `TValue`\> & `ExtractFeatureMapTypes`\<`TFeatures`, `Header_FeatureMap`\> & `THeaderComponents` & `object`

##### state

`TSelected`

#### Returns

`ComponentChildren`

***

### header

```ts
header: Header<TFeatures, TData, TValue>;
```

Defined in: [createTableHook.tsx:455](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L455)

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [createTableHook.tsx:461](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L461)

#### Parameters

##### state

`TableState`\<`TFeatures`\>

#### Returns

`TSelected`

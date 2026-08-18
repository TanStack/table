---
id: AppHeaderPropsWithSelector
title: AppHeaderPropsWithSelector
---

# Interface: AppHeaderPropsWithSelector\<TFeatures, TData, TValue, THeaderComponents, TSelected\>

Defined in: [createTableHook.tsx:451](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L451)

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
children: (header, state) => ReactNode;
```

Defined in: [createTableHook.tsx:459](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L459)

#### Parameters

##### header

`Header_Core`\<`TFeatures`, `TData`, `TValue`\> & `ExtractFeatureMapTypes`\<`TFeatures`, `Header_FeatureMap`\> & `THeaderComponents` & `object`

##### state

`TSelected`

#### Returns

`ReactNode`

***

### header

```ts
header: Header<TFeatures, TData, TValue>;
```

Defined in: [createTableHook.tsx:458](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L458)

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [createTableHook.tsx:464](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L464)

#### Parameters

##### state

`TableState`\<`TFeatures`\>

#### Returns

`TSelected`

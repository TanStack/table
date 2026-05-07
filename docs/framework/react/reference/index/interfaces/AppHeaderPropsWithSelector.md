---
id: AppHeaderPropsWithSelector
title: AppHeaderPropsWithSelector
---

# Interface: AppHeaderPropsWithSelector\<TFeatures, TData, TValue, THeaderComponents, TSelected\>

Defined in: [createTableHook.tsx:349](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L349)

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

Defined in: [createTableHook.tsx:357](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L357)

#### Parameters

##### header

`Header_Core`\<`TFeatures`, `TData`, `TValue`\> & `UnionToIntersection`\<
  \| `"columnSizingFeature"` *extends* keyof `TFeatures` ? `Header_ColumnSizing` : `never`
  \| `"columnResizingFeature"` *extends* keyof `TFeatures` ? `Header_ColumnResizing` : `never`\> & `UnionToIntersection`\<\{ \[K in string \| number \| symbol\]: K extends "coreReativityFeature" ? never : TFeatures\[K\] extends TableFeature\<FeatureConstructorOptions\> ? "Header" extends keyof FeatureConstructorOptions ? FeatureConstructorOptions\[keyof (...) & "Header"\] : never : any \}\[keyof `TFeatures`\]\> & `Header_Plugins`\<`TFeatures`, `TData`, `TValue`\> & `THeaderComponents` & `object`

##### state

`TSelected`

#### Returns

`ReactNode`

***

### header

```ts
header: Header<TFeatures, TData, TValue>;
```

Defined in: [createTableHook.tsx:356](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L356)

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [createTableHook.tsx:362](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L362)

#### Parameters

##### state

`TableState`\<`TFeatures`\>

#### Returns

`TSelected`

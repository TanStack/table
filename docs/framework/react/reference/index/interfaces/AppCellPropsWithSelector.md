---
id: AppCellPropsWithSelector
title: AppCellPropsWithSelector
---

# Interface: AppCellPropsWithSelector\<TFeatures, TData, TValue, TCellComponents, TSelected\>

Defined in: [createTableHook.tsx:313](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L313)

Props for AppCell component - with selector

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData`

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>

### TSelected

`TSelected`

## Properties

### cell

```ts
cell: Cell<TFeatures, TData, TValue>;
```

Defined in: [createTableHook.tsx:320](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L320)

***

### children()

```ts
children: (cell, state) => ReactNode;
```

Defined in: [createTableHook.tsx:321](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L321)

#### Parameters

##### cell

`Cell_Cell`\<`TFeatures`, `TData`, `TValue`\> & `UnionToIntersection`\<`"columnGroupingFeature"` *extends* keyof `TFeatures` ? `Cell_ColumnGrouping` : `never`\> & `UnionToIntersection`\<\{ \[K in string \| number \| symbol\]: K extends "coreReativityFeature" ? never : TFeatures\[K\] extends TableFeature\<FeatureConstructorOptions\> ? "Cell" extends keyof FeatureConstructorOptions ? FeatureConstructorOptions\[keyof (...) & "Cell"\] : never : any \}\[keyof `TFeatures`\]\> & `Cell_Plugins`\<`TFeatures`, `TData`, `TValue`\> & `TCellComponents` & `object`

##### state

`TSelected`

#### Returns

`ReactNode`

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [createTableHook.tsx:326](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L326)

#### Parameters

##### state

`TableState`\<`TFeatures`\>

#### Returns

`TSelected`

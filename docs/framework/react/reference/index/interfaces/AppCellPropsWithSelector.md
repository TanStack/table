---
id: AppCellPropsWithSelector
title: AppCellPropsWithSelector
---

# Interface: AppCellPropsWithSelector\<TFeatures, TData, TValue, TCellComponents, TSelected\>

Defined in: [createTableHook.tsx:416](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L416)

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

Defined in: [createTableHook.tsx:423](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L423)

***

### children()

```ts
children: (cell, state) => ReactNode;
```

Defined in: [createTableHook.tsx:424](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L424)

#### Parameters

##### cell

`Cell_Core`\<`TFeatures`, `TData`, `TValue`\> & `ExtractFeatureMapTypes`\<`TFeatures`, `Cell_FeatureMap`\> & `TCellComponents` & `object`

##### state

`TSelected`

#### Returns

`ReactNode`

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [createTableHook.tsx:429](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L429)

#### Parameters

##### state

`TableState`\<`TFeatures`\>

#### Returns

`TSelected`

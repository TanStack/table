---
id: AppCellPropsWithSelector
title: AppCellPropsWithSelector
---

# Interface: AppCellPropsWithSelector\<TFeatures, TData, TValue, TCellComponents, TSelected\>

Defined in: [createTableHook.tsx:413](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L413)

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

Defined in: [createTableHook.tsx:420](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L420)

***

### children()

```ts
children: (cell, state) => ComponentChildren;
```

Defined in: [createTableHook.tsx:421](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L421)

#### Parameters

##### cell

`Cell_Core`\<`TFeatures`, `TData`, `TValue`\> & `ExtractFeatureMapTypes`\<`TFeatures`, `Cell_FeatureMap`\> & `TCellComponents` & `object`

##### state

`TSelected`

#### Returns

`ComponentChildren`

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [createTableHook.tsx:426](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L426)

#### Parameters

##### state

`TableState`\<`TFeatures`\>

#### Returns

`TSelected`

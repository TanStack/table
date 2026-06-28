---
id: AppCellPropsWithoutSelector
title: AppCellPropsWithoutSelector
---

# Interface: AppCellPropsWithoutSelector\<TFeatures, TData, TValue, TCellComponents\>

Defined in: [createTableHook.tsx:399](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L399)

Props for AppCell component - without selector

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData`

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>

## Properties

### cell

```ts
cell: Cell<TFeatures, TData, TValue>;
```

Defined in: [createTableHook.tsx:405](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L405)

***

### children()

```ts
children: (cell) => ReactNode;
```

Defined in: [createTableHook.tsx:406](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L406)

#### Parameters

##### cell

`Cell_Core`\<`TFeatures`, `TData`, `TValue`\> & `ExtractFeatureMapTypes`\<`TFeatures`, `Cell_FeatureMap`\> & `TCellComponents` & `object`

#### Returns

`ReactNode`

***

### selector?

```ts
optional selector: undefined;
```

Defined in: [createTableHook.tsx:410](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L410)

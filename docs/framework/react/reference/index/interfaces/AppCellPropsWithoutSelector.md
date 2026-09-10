---
id: AppCellPropsWithoutSelector
title: AppCellPropsWithoutSelector
---

# Interface: AppCellPropsWithoutSelector\<TFeatures, TData, TValue, TCellComponents\>

Defined in: [react-table/src/createTableHook.tsx:398](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L398)

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

Defined in: [react-table/src/createTableHook.tsx:404](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L404)

***

### children()

```ts
children: (cell) => ReactNode;
```

Defined in: [react-table/src/createTableHook.tsx:405](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L405)

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

Defined in: [react-table/src/createTableHook.tsx:409](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L409)

---
id: AppCellPropsWithoutSelector
title: AppCellPropsWithoutSelector
---

# Interface: AppCellPropsWithoutSelector\<TFeatures, TData, TValue, TCellComponents\>

Defined in: [createTableHook.tsx:296](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L296)

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

Defined in: [createTableHook.tsx:302](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L302)

***

### children()

```ts
children: (cell) => ReactNode;
```

Defined in: [createTableHook.tsx:303](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L303)

#### Parameters

##### cell

`Cell_Cell`\<`TFeatures`, `TData`, `TValue`\> & `UnionToIntersection`\<`"columnGroupingFeature"` *extends* keyof `TFeatures` ? `Cell_ColumnGrouping` : `never`\> & `UnionToIntersection`\<\{ \[K in string \| number \| symbol\]: TFeatures\[K\] extends TableFeature\<FeatureConstructorOptions\> ? "Cell" extends keyof FeatureConstructorOptions ? FeatureConstructorOptions\[keyof FeatureConstructorOptions & "Cell"\] : never : any \}\[keyof `TFeatures`\]\> & `Cell_Plugins`\<`TFeatures`, `TData`, `TValue`\> & `TCellComponents` & `object`

#### Returns

`ReactNode`

***

### selector?

```ts
optional selector: undefined;
```

Defined in: [createTableHook.tsx:307](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L307)

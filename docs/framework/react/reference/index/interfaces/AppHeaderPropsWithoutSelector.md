---
id: AppHeaderPropsWithoutSelector
title: AppHeaderPropsWithoutSelector
---

# Interface: AppHeaderPropsWithoutSelector\<TFeatures, TData, TValue, THeaderComponents\>

Defined in: [createTableHook.tsx:332](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L332)

Props for AppHeader/AppFooter component - without selector

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData`

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>

## Properties

### children()

```ts
children: (header) => ReactNode;
```

Defined in: [createTableHook.tsx:339](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L339)

#### Parameters

##### header

`Header_Core`\<`TFeatures`, `TData`, `TValue`\> & `UnionToIntersection`\<
  \| `"columnSizingFeature"` *extends* keyof `TFeatures` ? `Header_ColumnSizing` : `never`
  \| `"columnResizingFeature"` *extends* keyof `TFeatures` ? `Header_ColumnResizing` : `never`\> & `UnionToIntersection`\<\{ \[K in string \| number \| symbol\]: K extends "coreReativityFeature" ? never : TFeatures\[K\] extends TableFeature\<FeatureConstructorOptions\> ? "Header" extends keyof FeatureConstructorOptions ? FeatureConstructorOptions\[keyof (...) & "Header"\] : never : any \}\[keyof `TFeatures`\]\> & `Header_Plugins`\<`TFeatures`, `TData`, `TValue`\> & `THeaderComponents` & `object`

#### Returns

`ReactNode`

***

### header

```ts
header: Header<TFeatures, TData, TValue>;
```

Defined in: [createTableHook.tsx:338](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L338)

***

### selector?

```ts
optional selector: undefined;
```

Defined in: [createTableHook.tsx:343](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L343)

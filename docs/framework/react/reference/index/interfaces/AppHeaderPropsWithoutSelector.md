---
id: AppHeaderPropsWithoutSelector
title: AppHeaderPropsWithoutSelector
---

# Interface: AppHeaderPropsWithoutSelector\<TFeatures, TData, TValue, THeaderComponents\>

Defined in: [createTableHook.tsx:435](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L435)

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

Defined in: [createTableHook.tsx:442](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L442)

#### Parameters

##### header

`Header_Core`\<`TFeatures`, `TData`, `TValue`\> & `ExtractFeatureMapTypes`\<`TFeatures`, `Header_FeatureMap`\> & `THeaderComponents` & `object`

#### Returns

`ReactNode`

***

### header

```ts
header: Header<TFeatures, TData, TValue>;
```

Defined in: [createTableHook.tsx:441](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L441)

***

### selector?

```ts
optional selector: undefined;
```

Defined in: [createTableHook.tsx:446](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L446)

---
id: AppHeaderPropsWithoutSelector
title: AppHeaderPropsWithoutSelector
---

# Interface: AppHeaderPropsWithoutSelector\<TFeatures, TData, TValue, THeaderComponents\>

Defined in: [createTableHook.tsx:432](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L432)

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
children: (header) => ComponentChildren;
```

Defined in: [createTableHook.tsx:439](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L439)

#### Parameters

##### header

`Header_Core`\<`TFeatures`, `TData`, `TValue`\> & `ExtractFeatureMapTypes`\<`TFeatures`, `Header_FeatureMap`\> & `THeaderComponents` & `object`

#### Returns

`ComponentChildren`

***

### header

```ts
header: Header<TFeatures, TData, TValue>;
```

Defined in: [createTableHook.tsx:438](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L438)

***

### selector?

```ts
optional selector: undefined;
```

Defined in: [createTableHook.tsx:443](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L443)

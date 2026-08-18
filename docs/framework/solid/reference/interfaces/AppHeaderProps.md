---
id: AppHeaderProps
title: AppHeaderProps
---

# Interface: AppHeaderProps\<TFeatures, TData, TValue, THeaderComponents\>

Defined in: [createTableHook.tsx:295](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L295)

Props for AppHeader/AppFooter component.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData`

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`ComponentType`](../type-aliases/ComponentType.md)\<`any`\>\>

## Properties

### children()

```ts
children: (header) => Element;
```

Defined in: [createTableHook.tsx:302](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L302)

#### Parameters

##### header

`Header_Core`\<`TFeatures`, `TData`, `TValue`\> & `ExtractFeatureMapTypes`\<`TFeatures`, `Header_FeatureMap`\> & `THeaderComponents` & `object`

#### Returns

`Element`

***

### header

```ts
header: Header<TFeatures, TData, TValue>;
```

Defined in: [createTableHook.tsx:301](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L301)

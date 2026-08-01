---
id: AppHeaderPropsWithoutSelector
title: AppHeaderPropsWithoutSelector
---

# Interface: AppHeaderPropsWithoutSelector\<TFeatures, TData, TValue, THeaderComponents\>

Defined in: [types.ts:639](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L639)

Props for AppHeader/AppFooter component — without selector.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData`

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`TableComponentType`](../type-aliases/TableComponentType.md)\>

## Properties

### children()

```ts
children: (header) => unknown;
```

Defined in: [types.ts:646](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L646)

#### Parameters

##### header

`Header_Core`\<`TFeatures`, `TData`, `TValue`\> & `ExtractFeatureMapTypes`\<`TFeatures`, `Header_FeatureMap`\> & `THeaderComponents` & `object`

#### Returns

`unknown`

***

### header

```ts
header: Header<TFeatures, TData, TValue>;
```

Defined in: [types.ts:645](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L645)

***

### selector?

```ts
optional selector: undefined;
```

Defined in: [types.ts:650](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L650)

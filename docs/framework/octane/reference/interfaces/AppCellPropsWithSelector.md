---
id: AppCellPropsWithSelector
title: AppCellPropsWithSelector
---

# Interface: AppCellPropsWithSelector\<TFeatures, TData, TValue, TCellComponents, TSelected\>

Defined in: [types.ts:622](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L622)

Props for AppCell component — with selector.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData`

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, [`TableComponentType`](../type-aliases/TableComponentType.md)\>

### TSelected

`TSelected`

## Properties

### cell

```ts
cell: Cell<TFeatures, TData, TValue>;
```

Defined in: [types.ts:629](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L629)

***

### children()

```ts
children: (cell, state) => unknown;
```

Defined in: [types.ts:630](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L630)

#### Parameters

##### cell

`Cell_Core`\<`TFeatures`, `TData`, `TValue`\> & `ExtractFeatureMapTypes`\<`TFeatures`, `Cell_FeatureMap`\> & `TCellComponents` & `object`

##### state

`TSelected`

#### Returns

`unknown`

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [types.ts:635](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L635)

#### Parameters

##### state

`TableState`\<`TFeatures`\>

#### Returns

`TSelected`

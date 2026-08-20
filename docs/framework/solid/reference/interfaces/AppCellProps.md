---
id: AppCellProps
title: AppCellProps
---

# Interface: AppCellProps\<TFeatures, TData, TValue, TCellComponents\>

Defined in: [createTableHook.tsx:279](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L279)

Props for AppCell component.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData`

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, [`ComponentType`](../type-aliases/ComponentType.md)\<`any`\>\>

## Properties

### cell

```ts
cell: Cell<TFeatures, TData, TValue>;
```

Defined in: [createTableHook.tsx:285](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L285)

***

### children()

```ts
children: (cell) => Element;
```

Defined in: [createTableHook.tsx:286](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L286)

#### Parameters

##### cell

`Cell_Core`\<`TFeatures`, `TData`, `TValue`\> & `ExtractFeatureMapTypes`\<`TFeatures`, `Cell_FeatureMap`\> & `TCellComponents` & `object`

#### Returns

`Element`

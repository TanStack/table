---
id: AppCellPropsWithoutSelector
title: AppCellPropsWithoutSelector
---

# Interface: AppCellPropsWithoutSelector\<TFeatures, TData, TValue, TCellComponents\>

Defined in: [createTableHook.tsx:396](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L396)

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

Defined in: [createTableHook.tsx:402](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L402)

***

### children()

```ts
children: (cell) => ComponentChildren;
```

Defined in: [createTableHook.tsx:403](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L403)

#### Parameters

##### cell

`Cell_Core`\<`TFeatures`, `TData`, `TValue`\> & `ExtractFeatureMapTypes`\<`TFeatures`, `Cell_FeatureMap`\> & `TCellComponents` & `object`

#### Returns

`ComponentChildren`

***

### selector?

```ts
optional selector: undefined;
```

Defined in: [createTableHook.tsx:407](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L407)

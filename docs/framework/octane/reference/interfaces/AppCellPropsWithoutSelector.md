---
id: AppCellPropsWithoutSelector
title: AppCellPropsWithoutSelector
---

# Interface: AppCellPropsWithoutSelector\<TFeatures, TData, TValue, TCellComponents\>

Defined in: [types.ts:607](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L607)

Props for AppCell component — without selector.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData`

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, [`TableComponentType`](../type-aliases/TableComponentType.md)\>

## Properties

### cell

```ts
cell: Cell<TFeatures, TData, TValue>;
```

Defined in: [types.ts:613](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L613)

***

### children()

```ts
children: (cell) => unknown;
```

Defined in: [types.ts:614](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L614)

#### Parameters

##### cell

`Cell_Core`\<`TFeatures`, `TData`, `TValue`\> & `ExtractFeatureMapTypes`\<`TFeatures`, `Cell_FeatureMap`\> & `TCellComponents` & `object`

#### Returns

`unknown`

***

### selector?

```ts
optional selector: undefined;
```

Defined in: [types.ts:618](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L618)

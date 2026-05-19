---
id: Table_RowSorting
title: Table_RowSorting
---

# Interface: Table\_RowSorting\<TFeatures, TData\>

Defined in: [features/row-sorting/rowSortingFeature.types.ts:186](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L186)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### resetSorting()

```ts
resetSorting: (defaultState?) => void;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:195](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L195)

Resets `sorting` to `initialState.sorting`.

Pass `true` to ignore initial state and reset to `[]`.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### setSorting()

```ts
setSorting: (updater) => void;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:199](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L199)

Updates sorting state with a next ordered array or updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`SortingState`](../type-aliases/SortingState.md)\>

#### Returns

`void`

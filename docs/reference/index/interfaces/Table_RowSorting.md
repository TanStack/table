---
id: Table_RowSorting
title: Table_RowSorting
---

# Interface: Table\_RowSorting\<_TFeatures, _TData\>

Defined in: [features/row-sorting/rowSortingFeature.types.ts:253](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L253)

## Type Parameters

### _TFeatures

`_TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### _TData

`_TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### resetSorting()

```ts
resetSorting: (defaultState?) => void;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:262](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L262)

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

Defined in: [features/row-sorting/rowSortingFeature.types.ts:266](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L266)

Updates sorting state with a next ordered array or updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`SortingState`](../type-aliases/SortingState.md)\>

#### Returns

`void`

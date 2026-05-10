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

Defined in: [features/row-sorting/rowSortingFeature.types.ts:193](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L193)

Resets the **sorting** state to `initialState.sorting`, or `true` can be passed to force a default blank state reset to `[]`.

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

Defined in: [features/row-sorting/rowSortingFeature.types.ts:197](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L197)

Sets sorting state using a value or updater.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`SortingState`](../type-aliases/SortingState.md)\>

#### Returns

`void`

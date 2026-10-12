---
id: Table_RowSorting
title: Table_RowSorting
---

Defined in: [features/row-sorting/rowSortingFeature.types.ts:266](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L266)

## Type Parameters

### _TFeatures

`_TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### _TData

`_TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### autoResetSorting

```ts
autoResetSorting: () => void;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:277](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L277)

Resets sorting after the table data changes when explicitly enabled.

Honors `autoResetAll` and `autoResetSorting`; sorting is preserved by
default. Called by the core row model; you rarely need to invoke it
yourself.

#### Returns

`void`

***

### resetSorting

```ts
resetSorting: (defaultState?) => void;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:283](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L283)

Resets `sorting` to `initialState.sorting`.

Pass `true` to ignore initial state and reset to `[]`.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### setSorting

```ts
setSorting: (updater) => void;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:287](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L287)

Updates sorting state with a next ordered array or updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`SortingState`](../type-aliases/SortingState.md)\>

#### Returns

`void`

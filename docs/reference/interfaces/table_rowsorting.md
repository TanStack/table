---
id: Table_RowSorting
title: Table_RowSorting
---

# Interface: Table\_RowSorting\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### resetSorting()

```ts
resetSorting: (defaultState?) => void;
```

Resets the **sorting** state to `initialState.sorting`, or `true` can be passed to force a default blank state reset to `[]`.

#### Parameters

• **defaultState?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#resetsorting)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:247](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L247)

***

### setSorting()

```ts
setSorting: (updater) => void;
```

Sets or updates the `state.sorting` state.

#### Parameters

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`SortingState`](../type-aliases/sortingstate.md)\>

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#setsorting)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:253](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L253)

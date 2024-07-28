---
id: Table_RowSorting
title: Table_RowSorting
---

# Interface: Table\_RowSorting\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### getPreSortedRowModel()

```ts
getPreSortedRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model for the table before any sorting has been applied.

#### Returns

`RowModel`\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getpresortedrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:256](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L256)

***

### getSortedRowModel()

```ts
getSortedRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model for the table after sorting has been applied.

#### Returns

`RowModel`\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getsortedrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:262](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L262)

***

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

[features/row-sorting/RowSorting.types.ts:268](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L268)

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

[features/row-sorting/RowSorting.types.ts:274](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L274)

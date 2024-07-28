---
id: Column_RowSorting
title: Column_RowSorting
---

# Interface: Column\_RowSorting\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### clearSorting()

```ts
clearSorting: () => void;
```

Removes this column from the table's sorting state

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#clearsorting)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:102](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L102)

***

### getAutoSortDir()

```ts
getAutoSortDir: () => SortDirection;
```

Returns a sort direction automatically inferred based on the columns values.

#### Returns

[`SortDirection`](../type-aliases/sortdirection.md)

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getautosortdir)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:108](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L108)

***

### getAutoSortingFn()

```ts
getAutoSortingFn: () => SortingFn<TFeatures, TData>;
```

Returns a sorting function automatically inferred based on the columns values.

#### Returns

[`SortingFn`](sortingfn.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getautosortingfn)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:114](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L114)

***

### getCanMultiSort()

```ts
getCanMultiSort: () => boolean;
```

Returns whether this column can be multi-sorted.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getcanmultisort)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:120](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L120)

***

### getCanSort()

```ts
getCanSort: () => boolean;
```

Returns whether this column can be sorted.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getcansort)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:126](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L126)

***

### getFirstSortDir()

```ts
getFirstSortDir: () => SortDirection;
```

Returns the first direction that should be used when sorting this column.

#### Returns

[`SortDirection`](../type-aliases/sortdirection.md)

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getfirstsortdir)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:132](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L132)

***

### getIsSorted()

```ts
getIsSorted: () => false | SortDirection;
```

Returns the current sort direction of this column.

#### Returns

`false` \| [`SortDirection`](../type-aliases/sortdirection.md)

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getissorted)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:138](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L138)

***

### getNextSortingOrder()

```ts
getNextSortingOrder: () => false | SortDirection;
```

Returns the next sorting order.

#### Returns

`false` \| [`SortDirection`](../type-aliases/sortdirection.md)

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getnextsortingorder)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:144](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L144)

***

### getSortIndex()

```ts
getSortIndex: () => number;
```

Returns the index position of this column's sorting within the sorting state

#### Returns

`number`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getsortindex)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:150](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L150)

***

### getSortingFn()

```ts
getSortingFn: () => SortingFn<TFeatures, TData>;
```

Returns the resolved sorting function to be used for this column

#### Returns

[`SortingFn`](sortingfn.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getsortingfn)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:156](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L156)

***

### getToggleSortingHandler()

```ts
getToggleSortingHandler: () => undefined | (event) => void;
```

Returns a function that can be used to toggle this column's sorting state. This is useful for attaching a click handler to the column header.

#### Returns

`undefined` \| (`event`) => `void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#gettogglesortinghandler)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:162](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L162)

***

### toggleSorting()

```ts
toggleSorting: (desc?, isMulti?) => void;
```

Toggles this columns sorting state. If `desc` is provided, it will force the sort direction to that value. If `isMulti` is provided, it will additivity multi-sort the column (or toggle it if it is already sorted).

#### Parameters

• **desc?**: `boolean`

• **isMulti?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#togglesorting)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:168](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L168)

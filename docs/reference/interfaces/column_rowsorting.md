---
id: Column_RowSorting
title: Column_RowSorting
---

# Interface: Column\_RowSorting\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

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

[features/row-sorting/RowSorting.types.ts:110](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L110)

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

[features/row-sorting/RowSorting.types.ts:116](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L116)

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

[features/row-sorting/RowSorting.types.ts:122](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L122)

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

[features/row-sorting/RowSorting.types.ts:128](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L128)

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

[features/row-sorting/RowSorting.types.ts:134](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L134)

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

[features/row-sorting/RowSorting.types.ts:140](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L140)

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

[features/row-sorting/RowSorting.types.ts:146](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L146)

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

[features/row-sorting/RowSorting.types.ts:152](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L152)

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

[features/row-sorting/RowSorting.types.ts:158](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L158)

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

[features/row-sorting/RowSorting.types.ts:164](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L164)

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

[features/row-sorting/RowSorting.types.ts:170](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L170)

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

[features/row-sorting/RowSorting.types.ts:176](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L176)

---
id: Column_RowSorting
title: Column_RowSorting
---

# Interface: Column\_RowSorting\<TFeatures, TData\>

Defined in: [features/row-sorting/rowSortingFeature.types.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L89)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### clearSorting()

```ts
clearSorting: () => void;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:96](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L96)

Removes this column from the table's sorting state

#### Returns

`void`

***

### getAutoSortDir()

```ts
getAutoSortDir: () => SortDirection;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:100](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L100)

Returns a sort direction automatically inferred based on the columns values.

#### Returns

[`SortDirection`](../type-aliases/SortDirection.md)

***

### getAutoSortFn()

```ts
getAutoSortFn: () => SortFn<TFeatures, TData>;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:104](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L104)

Returns a sorting function automatically inferred based on the columns values.

#### Returns

[`SortFn`](SortFn.md)\<`TFeatures`, `TData`\>

***

### getCanMultiSort()

```ts
getCanMultiSort: () => boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:108](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L108)

Returns whether this column can be multi-sorted.

#### Returns

`boolean`

***

### getCanSort()

```ts
getCanSort: () => boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:112](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L112)

Returns whether this column can be sorted.

#### Returns

`boolean`

***

### getFirstSortDir()

```ts
getFirstSortDir: () => SortDirection;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:116](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L116)

Returns the first direction that should be used when sorting this column.

#### Returns

[`SortDirection`](../type-aliases/SortDirection.md)

***

### getIsSorted()

```ts
getIsSorted: () => false | SortDirection;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:120](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L120)

Returns the current sort direction of this column.

#### Returns

`false` \| [`SortDirection`](../type-aliases/SortDirection.md)

***

### getNextSortingOrder()

```ts
getNextSortingOrder: () => false | SortDirection;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:124](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L124)

Returns the next sorting order.

#### Returns

`false` \| [`SortDirection`](../type-aliases/SortDirection.md)

***

### getSortFn()

```ts
getSortFn: () => SortFn<TFeatures, TData>;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:132](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L132)

Returns the resolved sorting function to be used for this column

#### Returns

[`SortFn`](SortFn.md)\<`TFeatures`, `TData`\>

***

### getSortIndex()

```ts
getSortIndex: () => number;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:128](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L128)

Returns the index position of this column's sorting within the sorting state

#### Returns

`number`

***

### getToggleSortingHandler()

```ts
getToggleSortingHandler: () => (event) => void | undefined;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:136](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L136)

Returns a function that can be used to toggle this column's sorting state. This is useful for attaching a click handler to the column header.

#### Returns

(`event`) => `void` \| `undefined`

***

### toggleSorting()

```ts
toggleSorting: (desc?, isMulti?) => void;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:140](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L140)

Toggles this columns sorting state. If `desc` is provided, it will force the sort direction to that value. If `isMulti` is provided, it will additivity multi-sort the column (or toggle it if it is already sorted).

#### Parameters

##### desc?

`boolean`

##### isMulti?

`boolean`

#### Returns

`void`

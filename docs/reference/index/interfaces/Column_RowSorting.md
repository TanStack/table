---
id: Column_RowSorting
title: Column_RowSorting
---

# Interface: Column\_RowSorting\<TFeatures, TData\>

Defined in: [features/row-sorting/rowSortingFeature.types.ts:104](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L104)

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

Defined in: [features/row-sorting/rowSortingFeature.types.ts:111](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L111)

Removes this column from the table's sorting state

#### Returns

`void`

***

### getAutoSortDir()

```ts
getAutoSortDir: () => SortDirection;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:115](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L115)

Returns a sort direction automatically inferred based on the columns values.

#### Returns

[`SortDirection`](../type-aliases/SortDirection.md)

***

### getAutoSortFn()

```ts
getAutoSortFn: () => SortFn<TFeatures, TData>;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:119](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L119)

Returns a sorting function automatically inferred based on the columns values.

#### Returns

[`SortFn`](SortFn.md)\<`TFeatures`, `TData`\>

***

### getCanMultiSort()

```ts
getCanMultiSort: () => boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:123](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L123)

Returns whether this column can be multi-sorted.

#### Returns

`boolean`

***

### getCanSort()

```ts
getCanSort: () => boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:127](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L127)

Returns whether this column can be sorted.

#### Returns

`boolean`

***

### getFirstSortDir()

```ts
getFirstSortDir: () => SortDirection;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:131](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L131)

Returns the first direction that should be used when sorting this column.

#### Returns

[`SortDirection`](../type-aliases/SortDirection.md)

***

### getIsSorted()

```ts
getIsSorted: () => false | SortDirection;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:135](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L135)

Reads this column's current sort direction, or `false` when unsorted.

#### Returns

`false` \| [`SortDirection`](../type-aliases/SortDirection.md)

***

### getNextSortingOrder()

```ts
getNextSortingOrder: () => false | SortDirection;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:139](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L139)

Returns the next sorting order.

#### Returns

`false` \| [`SortDirection`](../type-aliases/SortDirection.md)

***

### getSortFn()

```ts
getSortFn: () => SortFn<TFeatures, TData>;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:147](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L147)

Returns the resolved sorting function to be used for this column

#### Returns

[`SortFn`](SortFn.md)\<`TFeatures`, `TData`\>

***

### getSortIndex()

```ts
getSortIndex: () => number;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:143](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L143)

Finds this column's position in the ordered sorting state.

#### Returns

`number`

***

### getToggleSortingHandler()

```ts
getToggleSortingHandler: () => (event) => void | undefined;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:151](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L151)

Creates a header/control handler that toggles this column's sorting state.

#### Returns

(`event`) => `void` \| `undefined`

***

### toggleSorting()

```ts
toggleSorting: (desc?, isMulti?) => void;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:155](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L155)

Toggles this columns sorting state. If `desc` is provided, it will force the sort direction to that value. If `isMulti` is provided, it will additivity multi-sort the column (or toggle it if it is already sorted).

#### Parameters

##### desc?

`boolean`

##### isMulti?

`boolean`

#### Returns

`void`

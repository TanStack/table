---
id: Column_RowSorting
title: Column_RowSorting
---

# Interface: Column\_RowSorting\<TFeatures, TData\>

Defined in: [features/row-sorting/rowSortingFeature.types.ts:160](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L160)

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

Defined in: [features/row-sorting/rowSortingFeature.types.ts:167](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L167)

Removes this column from the table's sorting state

#### Returns

`void`

***

### getAutoSortDir()

```ts
getAutoSortDir: () => SortDirection;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:171](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L171)

Returns a sort direction automatically inferred based on the columns values.

#### Returns

[`SortDirection`](../type-aliases/SortDirection.md)

***

### getAutoSortFn()

```ts
getAutoSortFn: () => SortFn<TFeatures, TData>;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:175](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L175)

Returns a sorting function automatically inferred based on the columns values.

#### Returns

[`SortFn`](SortFn.md)\<`TFeatures`, `TData`\>

***

### getCanMultiSort()

```ts
getCanMultiSort: () => boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:179](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L179)

Returns whether this column can be multi-sorted.

#### Returns

`boolean`

***

### getCanSort()

```ts
getCanSort: () => boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:183](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L183)

Returns whether this column can be sorted.

#### Returns

`boolean`

***

### getFirstSortDir()

```ts
getFirstSortDir: () => SortDirection;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:187](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L187)

Returns the first direction that should be used when sorting this column.

#### Returns

[`SortDirection`](../type-aliases/SortDirection.md)

***

### getIsSorted()

```ts
getIsSorted: () => false | SortDirection;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:191](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L191)

Reads this column's current sort direction, or `false` when unsorted.

#### Returns

`false` \| [`SortDirection`](../type-aliases/SortDirection.md)

***

### getNextSortingOrder()

```ts
getNextSortingOrder: (multi?) => false | SortDirection;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:197](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L197)

Returns the next sorting order. Pass `multi` to resolve the order for a
multi-sort toggle, where `enableMultiRemove` governs whether the cycle can
remove the sort.

#### Parameters

##### multi?

`boolean`

#### Returns

`false` \| [`SortDirection`](../type-aliases/SortDirection.md)

***

### getSortFn()

```ts
getSortFn: () => SortFn<TFeatures, TData>;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:205](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L205)

Returns the resolved sorting function to be used for this column

#### Returns

[`SortFn`](SortFn.md)\<`TFeatures`, `TData`\>

***

### getSortIndex()

```ts
getSortIndex: () => number;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:201](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L201)

Finds this column's position in the ordered sorting state.

#### Returns

`number`

***

### getToggleSortingHandler()

```ts
getToggleSortingHandler: () => (event) => void | undefined;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:209](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L209)

Creates a header/control handler that toggles this column's sorting state.

#### Returns

(`event`) => `void` \| `undefined`

***

### toggleSorting()

```ts
toggleSorting: (desc?, isMulti?) => void;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:213](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L213)

Toggles this column's sorting state. If `desc` is provided, it will force the sort direction to that value. If `isMulti` is provided, it will additively multi-sort the column (or toggle it if it is already sorted).

#### Parameters

##### desc?

`boolean`

##### isMulti?

`boolean`

#### Returns

`void`

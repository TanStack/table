---
id: Column_RowSorting
title: Column_RowSorting
---

# Interface: Column\_RowSorting\<TFeatures, TData\>

Defined in: [features/row-sorting/rowSortingFeature.types.ts:156](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L156)

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

Defined in: [features/row-sorting/rowSortingFeature.types.ts:163](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L163)

Removes this column from the table's sorting state

#### Returns

`void`

***

### getAutoSortDir()

```ts
getAutoSortDir: () => SortDirection;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:167](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L167)

Returns a sort direction automatically inferred based on the columns values.

#### Returns

[`SortDirection`](../type-aliases/SortDirection.md)

***

### getAutoSortFn()

```ts
getAutoSortFn: () => SortFn<TFeatures, TData>;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:171](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L171)

Returns a sorting function automatically inferred based on the columns values.

#### Returns

[`SortFn`](SortFn.md)\<`TFeatures`, `TData`\>

***

### getCanMultiSort()

```ts
getCanMultiSort: () => boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:175](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L175)

Returns whether this column can be multi-sorted.

#### Returns

`boolean`

***

### getCanSort()

```ts
getCanSort: () => boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:179](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L179)

Returns whether this column can be sorted.

#### Returns

`boolean`

***

### getFirstSortDir()

```ts
getFirstSortDir: () => SortDirection;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:183](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L183)

Returns the first direction that should be used when sorting this column.

#### Returns

[`SortDirection`](../type-aliases/SortDirection.md)

***

### getIsSorted()

```ts
getIsSorted: () => false | SortDirection;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:187](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L187)

Reads this column's current sort direction, or `false` when unsorted.

#### Returns

`false` \| [`SortDirection`](../type-aliases/SortDirection.md)

***

### getNextSortingOrder()

```ts
getNextSortingOrder: (multi?) => false | SortDirection;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:193](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L193)

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

Defined in: [features/row-sorting/rowSortingFeature.types.ts:199](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L199)

Returns the resolved sorting function to be used for this column

#### Returns

[`SortFn`](SortFn.md)\<`TFeatures`, `TData`\>

***

### getSortIndex()

```ts
getSortIndex: () => number;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:195](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L195)

Finds this column's position in the ordered sorting state.

#### Returns

`number`

***

### getToggleSortingHandler()

```ts
getToggleSortingHandler: () => (event) => void | undefined;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:203](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L203)

Creates a header/control handler that toggles this column's sorting state.

#### Returns

(`event`) => `void` \| `undefined`

***

### toggleSorting()

```ts
toggleSorting: (desc?, isMulti?) => void;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:207](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L207)

Toggles this columns sorting state. If `desc` is provided, it will force the sort direction to that value. If `isMulti` is provided, it will additivity multi-sort the column (or toggle it if it is already sorted).

#### Parameters

##### desc?

`boolean`

##### isMulti?

`boolean`

#### Returns

`void`

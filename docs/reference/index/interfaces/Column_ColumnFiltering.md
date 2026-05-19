---
id: Column_ColumnFiltering
title: Column_ColumnFiltering
---

# Interface: Column\_ColumnFiltering\<TFeatures, TData\>

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:98](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L98)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getAutoFilterFn()

```ts
getAutoFilterFn: () => FilterFn<TFeatures, TData>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:105](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L105)

Returns an automatically calculated filter function for the column based off of the columns first known value.

#### Returns

[`FilterFn`](FilterFn.md)\<`TFeatures`, `TData`\>

***

### getCanFilter()

```ts
getCanFilter: () => boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:109](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L109)

Checks whether this accessor column can currently be column-filtered.

#### Returns

`boolean`

***

### getFilterFn()

```ts
getFilterFn: () => FilterFn<TFeatures, TData>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:113](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L113)

Returns the filter function (either user-defined or automatic, depending on configuration) for the columnId specified.

#### Returns

[`FilterFn`](FilterFn.md)\<`TFeatures`, `TData`\>

***

### getFilterIndex()

```ts
getFilterIndex: () => number;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:117](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L117)

Returns the index (including `-1`) of the column filter in the table's `state.columnFilters` array.

#### Returns

`number`

***

### getFilterValue()

```ts
getFilterValue: () => unknown;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:121](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L121)

Reads this column's current value from `state.columnFilters`.

#### Returns

`unknown`

***

### getIsFiltered()

```ts
getIsFiltered: () => boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:125](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L125)

Checks whether this column has an active entry in `state.columnFilters`.

#### Returns

`boolean`

***

### setFilterValue()

```ts
setFilterValue: (updater) => void;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:132](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L132)

Adds, updates, or removes this column's filter value.

Updater functions receive the previous filter value. Values that satisfy
the filter function's `autoRemove` rule are removed from filter state.

#### Parameters

##### updater

`any`

#### Returns

`void`

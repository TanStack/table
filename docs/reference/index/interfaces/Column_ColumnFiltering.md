---
id: Column_ColumnFiltering
title: Column_ColumnFiltering
---

# Interface: Column\_ColumnFiltering\<TFeatures, TData\>

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:194](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L194)

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

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:201](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L201)

Returns an automatically calculated filter function for the column based off of the columns first known value.

#### Returns

[`FilterFn`](FilterFn.md)\<`TFeatures`, `TData`\>

***

### getCanFilter()

```ts
getCanFilter: () => boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:205](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L205)

Checks whether this accessor column can currently be column-filtered.

#### Returns

`boolean`

***

### getFilterFn()

```ts
getFilterFn: () => FilterFn<TFeatures, TData>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:209](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L209)

Returns the filter function (either user-defined or automatic, depending on configuration) for the columnId specified.

#### Returns

[`FilterFn`](FilterFn.md)\<`TFeatures`, `TData`\>

***

### getFilterIndex()

```ts
getFilterIndex: () => number;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:213](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L213)

Returns the index (including `-1`) of the column filter in the table's `state.columnFilters` array.

#### Returns

`number`

***

### getFilterValue()

```ts
getFilterValue: () => unknown;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:217](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L217)

Reads this column's current value from `state.columnFilters`.

#### Returns

`unknown`

***

### getIsFiltered()

```ts
getIsFiltered: () => boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:221](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L221)

Checks whether this column has an active entry in `state.columnFilters`.

#### Returns

`boolean`

***

### setFilterValue()

```ts
setFilterValue: (updater) => void;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:228](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L228)

Adds, updates, or removes this column's filter value.

Updater functions receive the previous filter value. Values that satisfy
the filter function's `autoRemove` rule are removed from filter state.

#### Parameters

##### updater

`any`

#### Returns

`void`

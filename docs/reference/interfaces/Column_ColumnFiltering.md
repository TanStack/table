---
id: Column_ColumnFiltering
title: Column_ColumnFiltering
---

# Interface: Column\_ColumnFiltering\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts:95](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L95)

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

Defined in: [packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts:102](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L102)

Returns an automatically calculated filter function for the column based off of the columns first known value.

#### Returns

[`FilterFn`](FilterFn.md)\<`TFeatures`, `TData`\>

***

### getCanFilter()

```ts
getCanFilter: () => boolean;
```

Defined in: [packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts:106](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L106)

Returns whether or not the column can be **column** filtered.

#### Returns

`boolean`

***

### getFilterFn()

```ts
getFilterFn: () => FilterFn<TFeatures, TData>;
```

Defined in: [packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts:110](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L110)

Returns the filter function (either user-defined or automatic, depending on configuration) for the columnId specified.

#### Returns

[`FilterFn`](FilterFn.md)\<`TFeatures`, `TData`\>

***

### getFilterIndex()

```ts
getFilterIndex: () => number;
```

Defined in: [packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts:114](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L114)

Returns the index (including `-1`) of the column filter in the table's `state.columnFilters` array.

#### Returns

`number`

***

### getFilterValue()

```ts
getFilterValue: () => unknown;
```

Defined in: [packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts:118](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L118)

Returns the current filter value for the column.

#### Returns

`unknown`

***

### getIsFiltered()

```ts
getIsFiltered: () => boolean;
```

Defined in: [packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts:122](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L122)

Returns whether or not the column is currently filtered.

#### Returns

`boolean`

***

### setFilterValue()

```ts
setFilterValue: (updater) => void;
```

Defined in: [packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts:126](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L126)

A function that sets the current filter value for the column. You can pass it a value or an updater function for immutability-safe operations on existing values.

#### Parameters

##### updater

`any`

#### Returns

`void`

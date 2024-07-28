---
id: Column_ColumnFiltering
title: Column_ColumnFiltering
---

# Interface: Column\_ColumnFiltering\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### getAutoFilterFn()

```ts
getAutoFilterFn: () => undefined | FilterFn<TFeatures, TData>;
```

Returns an automatically calculated filter function for the column based off of the columns first known value.

#### Returns

`undefined` \| [`FilterFn`](filterfn.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getautofilterfn)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:100](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L100)

***

### getCanFilter()

```ts
getCanFilter: () => boolean;
```

Returns whether or not the column can be **column** filtered.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getcanfilter)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:106](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L106)

***

### getFilterFn()

```ts
getFilterFn: () => undefined | FilterFn<TFeatures, TData>;
```

Returns the filter function (either user-defined or automatic, depending on configuration) for the columnId specified.

#### Returns

`undefined` \| [`FilterFn`](filterfn.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getfilterfn)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:112](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L112)

***

### getFilterIndex()

```ts
getFilterIndex: () => number;
```

Returns the index (including `-1`) of the column filter in the table's `state.columnFilters` array.

#### Returns

`number`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getfilterindex)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:118](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L118)

***

### getFilterValue()

```ts
getFilterValue: () => unknown;
```

Returns the current filter value for the column.

#### Returns

`unknown`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getfiltervalue)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:124](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L124)

***

### getIsFiltered()

```ts
getIsFiltered: () => boolean;
```

Returns whether or not the column is currently filtered.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getisfiltered)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:130](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L130)

***

### setFilterValue()

```ts
setFilterValue: (updater) => void;
```

A function that sets the current filter value for the column. You can pass it a value or an updater function for immutability-safe operations on existing values.

#### Parameters

• **updater**: `any`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#setfiltervalue)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:136](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L136)

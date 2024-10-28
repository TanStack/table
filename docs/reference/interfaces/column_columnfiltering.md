---
id: Column_ColumnFiltering
title: Column_ColumnFiltering
---

# Interface: Column\_ColumnFiltering\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

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

[features/column-filtering/ColumnFiltering.types.ts:108](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L108)

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

[features/column-filtering/ColumnFiltering.types.ts:114](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L114)

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

[features/column-filtering/ColumnFiltering.types.ts:120](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L120)

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

[features/column-filtering/ColumnFiltering.types.ts:126](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L126)

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

[features/column-filtering/ColumnFiltering.types.ts:132](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L132)

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

[features/column-filtering/ColumnFiltering.types.ts:138](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L138)

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

[features/column-filtering/ColumnFiltering.types.ts:144](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L144)

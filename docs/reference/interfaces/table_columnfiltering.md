---
id: Table_ColumnFiltering
title: Table_ColumnFiltering
---

# Interface: Table\_ColumnFiltering\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### getFilteredRowModel()

```ts
getFilteredRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model for the table after **column** filtering has been applied.

#### Returns

`RowModel`\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getfilteredrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:227](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L227)

***

### getPreFilteredRowModel()

```ts
getPreFilteredRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model for the table before any **column** filtering has been applied.

#### Returns

`RowModel`\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getprefilteredrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:233](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L233)

***

### resetColumnFilters()

```ts
resetColumnFilters: (defaultState?) => void;
```

Resets the **columnFilters** state to `initialState.columnFilters`, or `true` can be passed to force a default blank state reset to `[]`.

#### Parameters

• **defaultState?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#resetcolumnfilters)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:239](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L239)

***

### resetGlobalFilter()

```ts
resetGlobalFilter: (defaultState?) => void;
```

Resets the **globalFilter** state to `initialState.globalFilter`, or `true` can be passed to force a default blank state reset to `undefined`.

#### Parameters

• **defaultState?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#resetglobalfilter)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:245](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L245)

***

### setColumnFilters()

```ts
setColumnFilters: (updater) => void;
```

Sets or updates the `state.columnFilters` state.

#### Parameters

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`ColumnFiltersState`](../type-aliases/columnfiltersstate.md)\>

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#setcolumnfilters)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:251](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L251)

***

### setGlobalFilter()

```ts
setGlobalFilter: (updater) => void;
```

Sets or updates the `state.globalFilter` state.

#### Parameters

• **updater**: `any`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#setglobalfilter)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:257](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L257)

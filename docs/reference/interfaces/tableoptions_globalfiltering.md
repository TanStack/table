---
id: TableOptions_GlobalFiltering
title: TableOptions_GlobalFiltering
---

# Interface: TableOptions\_GlobalFiltering\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### enableGlobalFilter?

```ts
optional enableGlobalFilter: boolean;
```

Enables/disables **global** filtering for all columns.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#enableglobalfilter)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)

#### Defined in

[features/global-filtering/GlobalFiltering.types.ts:45](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/global-filtering/GlobalFiltering.types.ts#L45)

***

### getColumnCanGlobalFilter()?

```ts
optional getColumnCanGlobalFilter: <TFeatures, TData, TValue>(column) => boolean;
```

If provided, this function will be called with the column and should return `true` or `false` to indicate whether this column should be used for global filtering.

This is useful if the column can contain data that is not `string` or `number` (i.e. `undefined`).

#### Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

#### Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#getcolumncanglobalfilter)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)

#### Defined in

[features/global-filtering/GlobalFiltering.types.ts:53](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/global-filtering/GlobalFiltering.types.ts#L53)

***

### globalFilterFn?

```ts
optional globalFilterFn: FilterFnOption<TFeatures, TData>;
```

The filter function to use for global filtering.
- A `string` referencing a built-in filter function
- A `string` that references a custom filter functions provided via the `tableOptions.filterFns` option
- A custom filter function

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#globalfilterfn)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)

#### Defined in

[features/global-filtering/GlobalFiltering.types.ts:68](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/global-filtering/GlobalFiltering.types.ts#L68)

***

### onGlobalFilterChange?

```ts
optional onGlobalFilterChange: OnChangeFn<any>;
```

If provided, this function will be called with an `updaterFn` when `state.globalFilter` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#onglobalfilterchange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)

#### Defined in

[features/global-filtering/GlobalFiltering.types.ts:74](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/global-filtering/GlobalFiltering.types.ts#L74)

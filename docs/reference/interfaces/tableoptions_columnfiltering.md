---
id: TableOptions_ColumnFiltering
title: TableOptions_ColumnFiltering
---

# Interface: TableOptions\_ColumnFiltering\<TFeatures, TData\>

## Extends

- `ColumnFiltersOptionsBase`\<`TFeatures`, `TData`\>.`ResolvedFilterFns`\<`TFeatures`, `TData`\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### enableColumnFilters?

```ts
optional enableColumnFilters: boolean;
```

Enables/disables **column** filtering for all columns.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#enablecolumnfilters)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Inherited from

`ColumnFiltersOptionsBase.enableColumnFilters`

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:166](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L166)

***

### enableFilters?

```ts
optional enableFilters: boolean;
```

Enables/disables all filtering for the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#enablefilters)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Inherited from

`ColumnFiltersOptionsBase.enableFilters`

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:172](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L172)

***

### filterFns?

```ts
optional filterFns: Record<string, FilterFn<TFeatures, TData>>;
```

#### Inherited from

`ResolvedFilterFns.filterFns`

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:206](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L206)

***

### filterFromLeafRows?

```ts
optional filterFromLeafRows: boolean;
```

By default, filtering is done from parent rows down (so if a parent row is filtered out, all of its children will be filtered out as well). Setting this option to `true` will cause filtering to be done from leaf rows up (which means parent rows will be included so long as one of their child or grand-child rows is also included).

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#filterfromleafrows)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Inherited from

`ColumnFiltersOptionsBase.filterFromLeafRows`

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:178](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L178)

***

### manualFiltering?

```ts
optional manualFiltering: boolean;
```

Disables the `getFilteredRowModel` from being used to filter data. This may be useful if your table needs to dynamically support both client-side and server-side filtering.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#manualfiltering)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Inherited from

`ColumnFiltersOptionsBase.manualFiltering`

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:184](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L184)

***

### maxLeafRowFilterDepth?

```ts
optional maxLeafRowFilterDepth: number;
```

By default, filtering is done for all rows (max depth of 100), no matter if they are root level parent rows or the child leaf rows of a parent row. Setting this option to `0` will cause filtering to only be applied to the root level parent rows, with all sub-rows remaining unfiltered. Similarly, setting this option to `1` will cause filtering to only be applied to child leaf rows 1 level deep, and so on.

This is useful for situations where you want a row's entire child hierarchy to be visible regardless of the applied filter.
 *

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#maxleafrowfilterdepth)
 *

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Inherited from

`ColumnFiltersOptionsBase.maxLeafRowFilterDepth`

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:192](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L192)

***

### onColumnFiltersChange?

```ts
optional onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
```

If provided, this function will be called with an `updaterFn` when `state.columnFilters` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#oncolumnfilterschange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Inherited from

`ColumnFiltersOptionsBase.onColumnFiltersChange`

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:198](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L198)

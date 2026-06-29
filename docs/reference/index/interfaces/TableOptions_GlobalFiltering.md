---
id: TableOptions_GlobalFiltering
title: TableOptions_GlobalFiltering
---

# Interface: TableOptions\_GlobalFiltering\<TFeatures, TData\>

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:35](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L35)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### enableGlobalFilter?

```ts
optional enableGlobalFilter: boolean;
```

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:42](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L42)

Enables global filtering across columns that allow it.

***

### getColumnCanGlobalFilter()?

```ts
optional getColumnCanGlobalFilter: <TFeatures, TData, TValue>(column) => boolean;
```

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:47](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L47)

If provided, this function will be called with the column and should return `true` or `false` to indicate whether this column should be used for global filtering.
This is useful if the column can contain data that is not `string` or `number` (i.e. `undefined`).

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Parameters

##### column

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `TValue`\>

#### Returns

`boolean`

***

### globalFilterFn?

```ts
optional globalFilterFn: FilterFnOption<TFeatures, TData>;
```

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L60)

The filter function to use for global filtering.
- A `string` referencing a built-in filter function
- A `string` that references a custom filter functions provided via the `tableOptions.filterFns` option
- A custom filter function

***

### onGlobalFilterChange?

```ts
optional onGlobalFilterChange: OnChangeFn<any>;
```

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:66](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L66)

Called with an updater when global filter state changes. Pair this with
`state.globalFilter` when using external state; external atoms can own the
slice without this callback.

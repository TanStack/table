---
id: TableOptions_GlobalFiltering
title: TableOptions_GlobalFiltering
---

# Interface: TableOptions\_GlobalFiltering\<TFeatures, TData\>

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L32)

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

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:39](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L39)

Enables/disables **global** filtering for all columns.

***

### getColumnCanGlobalFilter()?

```ts
optional getColumnCanGlobalFilter: <TFeatures, TData, TValue>(column) => boolean;
```

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:44](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L44)

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

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:57](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L57)

The filter function to use for global filtering.
- A `string` referencing a built-in filter function
- A `string` that references a custom filter functions provided via the `tableOptions.filterFns` option
- A custom filter function

***

### onGlobalFilterChange?

```ts
optional onGlobalFilterChange: OnChangeFn<any>;
```

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:61](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L61)

If provided, this function will be called with an `updaterFn` when `state.globalFilter` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

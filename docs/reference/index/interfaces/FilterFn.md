---
id: FilterFn
title: FilterFn
---

# Interface: FilterFn()\<TFeatures, TData\>

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L60)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

```ts
FilterFn(
   row,
   columnId,
   filterValue,
   addMeta?): boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:64](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L64)

## Parameters

### row

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

### columnId

`string`

### filterValue

`any`

### addMeta?

(`meta`) => `void`

## Returns

`boolean`

## Properties

### autoRemove?

```ts
optional autoRemove: ColumnFilterAutoRemoveTestFn<TFeatures, TData, unknown>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:74](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L74)

Removes the filter from `state.columnFilters` when the filter value fails
this test (e.g. empty strings for text filters).

***

### resolveDataValue?

```ts
optional resolveDataValue: TransformDataValueFn;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:87](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L87)

Normalizes each row's value before it is compared against the filter
value. Only honored by filter functions built with `constructFilterFn`
(including all built-in filter functions).

***

### resolveFilterValue?

```ts
optional resolveFilterValue: TransformFilterValueFn<TFeatures, TData, unknown>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:81](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L81)

Normalizes the filter value before filtering runs.

The table applies this once per filter (not per row) and passes the
resolved value to the filter function as `filterValue`.

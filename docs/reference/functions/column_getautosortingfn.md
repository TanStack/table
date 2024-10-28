---
id: column_getAutoSortingFn
title: column_getAutoSortingFn
---

# Function: column\_getAutoSortingFn()

```ts
function column_getAutoSortingFn<TFeatures, TData, TValue>(column): SortingFn<TFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column_Internal`](../type-aliases/column_internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

[`SortingFn`](../interfaces/sortingfn.md)\<`TFeatures`, `TData`\>

## Defined in

[features/row-sorting/RowSorting.utils.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.utils.ts#L30)

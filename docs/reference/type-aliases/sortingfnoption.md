---
id: SortingFnOption
title: SortingFnOption
---

# Type Alias: SortingFnOption\<TFeatures, TData\>

```ts
type SortingFnOption<TFeatures, TData>: "auto" | keyof SortingFns | BuiltInSortingFn | SortingFn<TFeatures, TData>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Defined in

[features/row-sorting/RowSorting.types.ts:46](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L46)

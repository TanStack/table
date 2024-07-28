---
id: SortingFnOption
title: SortingFnOption
---

# Type Alias: SortingFnOption\<TFeatures, TData\>

```ts
type SortingFnOption<TFeatures, TData>: "auto" | keyof SortingFns | BuiltInSortingFn | SortingFn<TFeatures, TData>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Defined in

[features/row-sorting/RowSorting.types.ts:38](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L38)

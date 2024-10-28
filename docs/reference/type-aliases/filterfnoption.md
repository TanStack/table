---
id: FilterFnOption
title: FilterFnOption
---

# Type Alias: FilterFnOption\<TFeatures, TData\>

```ts
type FilterFnOption<TFeatures, TData>: "auto" | BuiltInFilterFn | keyof FilterFns | FilterFn<TFeatures, TData>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Defined in

[features/column-filtering/ColumnFiltering.types.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L76)

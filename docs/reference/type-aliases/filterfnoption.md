---
id: FilterFnOption
title: FilterFnOption
---

# Type Alias: FilterFnOption\<TFeatures, TData\>

```ts
type FilterFnOption<TFeatures, TData>: "auto" | BuiltInFilterFn | keyof FilterFns | FilterFn<TFeatures, TData>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Defined in

[features/column-filtering/ColumnFiltering.types.ts:68](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L68)

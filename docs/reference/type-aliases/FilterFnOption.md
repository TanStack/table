---
id: FilterFnOption
title: FilterFnOption
---

# Type Alias: FilterFnOption\<TFeatures, TData\>

```ts
type FilterFnOption<TFeatures, TData> = 
  | "auto"
  | BuiltInFilterFn
  | keyof FilterFns
| FilterFn<TFeatures, TData>;
```

Defined in: [packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L76)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

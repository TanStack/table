---
id: SortFnOption
title: SortFnOption
---

# Type Alias: SortFnOption\<TFeatures, TData\>

```ts
type SortFnOption<TFeatures, TData> = 
  | "auto"
  | keyof SortFns
  | BuiltInSortFn
| SortFn<TFeatures, TData>;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:46](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L46)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

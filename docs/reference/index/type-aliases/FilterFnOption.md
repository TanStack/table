---
id: FilterFnOption
title: FilterFnOption
---

# Type Alias: FilterFnOption\<TFeatures, TData\>

```ts
type FilterFnOption<TFeatures, TData> = 
  | "auto"
  | ExtractFilterFnKeys<TFeatures>
| FilterFn<TFeatures, RowData>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:107](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L107)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

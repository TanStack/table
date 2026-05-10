---
id: CreateRowModels_All
title: CreateRowModels_All
---

# Type Alias: CreateRowModels\_All\<TFeatures, TData\>

```ts
type CreateRowModels_All<TFeatures, TData> = CreateRowModel_Core<TFeatures, TData> & CreateRowModel_Expanded<TFeatures, TData> & CreateRowModel_Faceted<TFeatures, TData> & CreateRowModel_Filtered<TFeatures, TData> & CreateRowModel_Grouped<TFeatures, TData> & CreateRowModel_Paginated<TFeatures, TData> & CreateRowModel_Sorted<TFeatures, TData>;
```

Defined in: [types/RowModel.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L76)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

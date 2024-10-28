---
id: CreateRowModels_All
title: CreateRowModels_All
---

# Type Alias: CreateRowModels\_All\<TFeatures, TData\>

```ts
type CreateRowModels_All<TFeatures, TData>: CreateRowModel_Core<TFeatures, TData> & CreateRowModel_Expanded<TFeatures, TData> & CreateRowModel_Faceted<TFeatures, TData> & CreateRowModel_Filtered<TFeatures, TData> & CreateRowModel_Grouped<TFeatures, TData> & CreateRowModel_Paginated<TFeatures, TData> & CreateRowModel_Sorted<TFeatures, TData>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Defined in

[types/RowModel.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L58)

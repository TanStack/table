---
id: CachedRowModel_All
title: CachedRowModel_All
---

# Type Alias: CachedRowModel\_All\<TFeatures, TData\>

```ts
type CachedRowModel_All<TFeatures, TData>: Partial<CachedRowModel_Core<TFeatures, TData> & CachedRowModel_Expanded<TFeatures, TData> & CachedRowModel_Faceted<TFeatures, TData> & CachedRowModel_Filtered<TFeatures, TData> & CachedRowModel_Grouped<TFeatures, TData> & CachedRowModel_Paginated<TFeatures, TData> & CachedRowModel_Sorted<TFeatures, TData>>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Defined in

[types/RowModel.ts:95](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L95)

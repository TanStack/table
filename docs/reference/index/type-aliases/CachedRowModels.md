---
id: CachedRowModels
title: CachedRowModels
---

# Type Alias: CachedRowModels\<TFeatures, TData\>

```ts
type CachedRowModels<TFeatures, TData> = Partial<CachedRowModel_Core<TFeatures, TData>> & ExtractFeatureMapTypes<TFeatures, CachedRowModels_FeatureMap<TFeatures, TData>>;
```

Defined in: [types/RowModel.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L23)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

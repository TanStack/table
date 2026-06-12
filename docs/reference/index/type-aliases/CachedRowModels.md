---
id: CachedRowModels
title: CachedRowModels
---

# Type Alias: CachedRowModels\<TFeatures, TData\>

```ts
type CachedRowModels<TFeatures, TData> = object & ExtractFeatureMapTypes<TFeatures, CachedRowModels_FeatureMap<TFeatures, TData>>;
```

Defined in: [types/RowModel.ts:26](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L26)

## Type Declaration

### CachedRowModel\_Core()

```ts
CachedRowModel_Core: () => RowModel<TFeatures, TData>;
```

#### Returns

[`RowModel`](../interfaces/RowModel.md)\<`TFeatures`, `TData`\>

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

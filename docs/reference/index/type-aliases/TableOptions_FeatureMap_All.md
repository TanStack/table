---
id: TableOptions_FeatureMap_All
title: TableOptions_FeatureMap_All
---

# Type Alias: TableOptions\_FeatureMap\_All\<TFeatures, TData\>

```ts
type TableOptions_FeatureMap_All<TFeatures, TData> = UnionToIntersection<TableOptions_FeatureMap<TFeatures, TData>[keyof TableOptions_FeatureMap<TFeatures, TData>]>;
```

Defined in: [types/TableOptions.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableOptions.ts#L76)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

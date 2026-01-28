---
id: Table_RowModels
title: Table_RowModels
---

# Type Alias: Table\_RowModels\<TFeatures, TData\>

```ts
type Table_RowModels<TFeatures, TData> = Table_RowModels_Core<TFeatures, TData> & Table_RowModels_Faceted<TFeatures, TData> & Table_RowModels_Filtered<TFeatures, TData> & Table_RowModels_Grouped<TFeatures, TData> & Table_RowModels_Expanded<TFeatures, TData> & Table_RowModels_Paginated<TFeatures, TData> & Table_RowModels_Sorted<TFeatures, TData>;
```

Defined in: [packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts#L58)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

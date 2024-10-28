---
id: Table_RowModels
title: Table_RowModels
---

# Type Alias: Table\_RowModels\<TFeatures, TData\>

```ts
type Table_RowModels<TFeatures, TData>: Table_RowModels_Core<TFeatures, TData> & Table_RowModels_Faceted<TFeatures, TData> & Table_RowModels_Filtered<TFeatures, TData> & Table_RowModels_Grouped<TFeatures, TData> & Table_RowModels_Expanded<TFeatures, TData> & Table_RowModels_Paginated<TFeatures, TData> & Table_RowModels_Sorted<TFeatures, TData>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Defined in

[core/row-models/RowModels.types.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/RowModels.types.ts#L60)

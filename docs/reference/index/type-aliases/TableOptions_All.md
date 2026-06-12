---
id: TableOptions_All
title: TableOptions_All
---

# Type Alias: TableOptions\_All\<TFeatures, TData\>

```ts
type TableOptions_All<TFeatures, TData> = TableOptions_Core<TFeatures, TData> & Partial<TableOptions_FeatureMap_All<TFeatures, TData>>;
```

Defined in: [types/TableOptions.ts:104](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableOptions.ts#L104)

Internal broad option shape used where feature code may need to read options
from features that are not present in the current generic feature set.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

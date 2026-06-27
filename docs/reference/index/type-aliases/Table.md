---
id: Table
title: Table
---

# Type Alias: Table\<TFeatures, TData\>

```ts
type Table<TFeatures, TData> = Table_Core<TFeatures, TData> & ExtractFeatureMapTypes<TFeatures, Table_FeatureMap<TFeatures, TData>>;
```

Defined in: [types/Table.ts:73](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Table.ts#L73)

The table object that includes both the core table functionality and the features that are enabled via the `features` table option.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

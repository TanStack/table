---
id: Table_Core
title: Table_Core
---

# Type Alias: Table\_Core\<TFeatures, TData\>

```ts
type Table_Core<TFeatures, TData> = Table_Table<TFeatures, TData> & Table_Columns<TFeatures, TData> & Table_Rows<TFeatures, TData> & Table_RowModels<TFeatures, TData> & Table_Headers<TFeatures, TData>;
```

Defined in: [types/Table.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Table.ts#L41)

The core table object that only includes the core table functionality such as column, header, row, and table APIS.
No features are included.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

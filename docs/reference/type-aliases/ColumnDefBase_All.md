---
id: ColumnDefBase_All
title: ColumnDefBase_All
---

# Type Alias: ColumnDefBase\_All\<TFeatures, TData, TValue\>

```ts
type ColumnDefBase_All<TFeatures, TData, TValue> = ColumnDefBase_Core<TFeatures, TData, TValue> & Partial<ColumnDef_ColumnVisibility & ColumnDef_ColumnPinning & ColumnDef_ColumnFiltering<TFeatures, TData> & ColumnDef_GlobalFiltering & ColumnDef_RowSorting<TFeatures, TData> & ColumnDef_ColumnGrouping<TFeatures, TData, TValue> & ColumnDef_ColumnSizing & ColumnDef_ColumnResizing>;
```

Defined in: [packages/table-core/src/types/ColumnDef.ts:117](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L117)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` *extends* [`CellData`](CellData.md) = [`CellData`](CellData.md)

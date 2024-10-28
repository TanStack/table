---
id: ColumnDefBase_All
title: ColumnDefBase_All
---

# Type Alias: ColumnDefBase\_All\<TFeatures, TData, TValue\>

```ts
type ColumnDefBase_All<TFeatures, TData, TValue>: ColumnDefBase_Core<TFeatures, TData, TValue> & Partial<ColumnDef_ColumnVisibility & ColumnDef_ColumnPinning & ColumnDef_ColumnFiltering<TFeatures, TData> & ColumnDef_GlobalFiltering & ColumnDef_RowSorting<TFeatures, TData> & ColumnDef_ColumnGrouping<TFeatures, TData, TValue> & ColumnDef_ColumnSizing & ColumnDef_ColumnResizing>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Defined in

[types/ColumnDef.ts:95](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L95)

---
id: ColumnDefBase
title: ColumnDefBase
---

# Type Alias: ColumnDefBase\<TFeatures, TData, TValue\>

```ts
type ColumnDefBase<TFeatures, TData, TValue>: ColumnDefBase_Core<TFeatures, TData, TValue> & UnionToIntersection<
  | "ColumnVisibility" extends keyof TFeatures ? ColumnDef_ColumnVisibility : never
  | "ColumnPinning" extends keyof TFeatures ? ColumnDef_ColumnPinning : never
  | "ColumnFiltering" extends keyof TFeatures ? ColumnDef_ColumnFiltering<TFeatures, TData> : never
  | "GlobalFiltering" extends keyof TFeatures ? ColumnDef_GlobalFiltering : never
  | "RowSorting" extends keyof TFeatures ? ColumnDef_RowSorting<TFeatures, TData> : never
  | "ColumnGrouping" extends keyof TFeatures ? ColumnDef_ColumnGrouping<TFeatures, TData, TValue> : never
  | "ColumnSizing" extends keyof TFeatures ? ColumnDef_ColumnSizing : never
| "ColumnResizing" extends keyof TFeatures ? ColumnDef_ColumnResizing : never>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Defined in

[types/ColumnDef.ts:65](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L65)

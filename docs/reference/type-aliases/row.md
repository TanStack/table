---
id: Row
title: Row
---

# Type Alias: Row\<TFeatures, TData\>

```ts
type Row<TFeatures, TData>: Row_Row<TFeatures, TData> & UnionToIntersection<
  | "ColumnFiltering" extends keyof TFeatures ? Row_ColumnFiltering<TFeatures, TData> : never
  | "ColumnGrouping" extends keyof TFeatures ? Row_ColumnGrouping : never
  | "ColumnPinning" extends keyof TFeatures ? Row_ColumnPinning<TFeatures, TData> : never
  | "ColumnVisibility" extends keyof TFeatures ? Row_ColumnVisibility<TFeatures, TData> : never
  | "RowExpanding" extends keyof TFeatures ? Row_RowExpanding : never
  | "RowPinning" extends keyof TFeatures ? Row_RowPinning : never
| "RowSelection" extends keyof TFeatures ? Row_RowSelection : never>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Defined in

[types/Row.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Row.ts#L12)

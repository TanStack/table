---
id: _Row
title: _Row
---

# Type Alias: \_Row\<TFeatures, TData\>

```ts
type _Row<TFeatures, TData>: Row_Row<TFeatures, TData> & UnionToIntersection<
  | "ColumnFiltering" extends keyof TFeatures ? Row_ColumnFiltering<TFeatures, TData> : never
  | "ColumnGrouping" extends keyof TFeatures ? Row_ColumnGrouping : never
  | "ColumnPinning" extends keyof TFeatures ? Row_ColumnPinning<TFeatures, TData> : never
  | "ColumnVisibility" extends keyof TFeatures ? Row_ColumnVisibility<TFeatures, TData> : never
  | "RowExpanding" extends keyof TFeatures ? Row_RowExpanding : never
  | "RowPinning" extends keyof TFeatures ? Row_RowPinning : never
| "RowSelection" extends keyof TFeatures ? Row_RowSelection : never>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Defined in

[types/Row.ts:12](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/types/Row.ts#L12)

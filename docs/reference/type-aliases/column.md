---
id: _Column
title: _Column
---

# Type Alias: \_Column\<TFeatures, TData, TValue\>

```ts
type _Column<TFeatures, TData, TValue>: Column_Column<TFeatures, TData, TValue> & UnionToIntersection<
  | "ColumnFaceting" extends keyof TFeatures ? Column_ColumnFaceting<TFeatures, TData> : never
  | "ColumnFiltering" extends keyof TFeatures ? Column_ColumnFiltering<TFeatures, TData> : never
  | "ColumnGrouping" extends keyof TFeatures ? Column_ColumnGrouping<TFeatures, TData> : never
  | "ColumnOrdering" extends keyof TFeatures ? Column_ColumnOrdering : never
  | "ColumnPinning" extends keyof TFeatures ? Column_ColumnPinning : never
  | "ColumnResizing" extends keyof TFeatures ? Column_ColumnResizing : never
  | "ColumnSizing" extends keyof TFeatures ? Column_ColumnSizing : never
  | "ColumnVisibility" extends keyof TFeatures ? Column_ColumnVisibility : never
  | "GlobalFiltering" extends keyof TFeatures ? Column_GlobalFiltering : never
| "RowSorting" extends keyof TFeatures ? Column_RowSorting<TFeatures, TData> : never>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** = `unknown`

## Defined in

[types/Column.ts:15](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/types/Column.ts#L15)

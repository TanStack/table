---
id: _TableState
title: _TableState
---

# Type Alias: \_TableState\<TFeatures\>

```ts
type _TableState<TFeatures>: UnionToIntersection<
  | "ColumnFiltering" extends keyof TFeatures ? TableState_ColumnFiltering : never
  | "ColumnGrouping" extends keyof TFeatures ? TableState_ColumnGrouping : never
  | "ColumnOrdering" extends keyof TFeatures ? TableState_ColumnOrdering : never
  | "ColumnPinning" extends keyof TFeatures ? TableState_ColumnPinning : never
  | "ColumnResizing" extends keyof TFeatures ? TableState_ColumnResizing : never
  | "ColumnSizing" extends keyof TFeatures ? TableState_ColumnSizing : never
  | "ColumnVisibility" extends keyof TFeatures ? TableState_ColumnVisibility : never
  | "GlobalFiltering" extends keyof TFeatures ? TableState_GlobalFiltering : never
  | "RowExpanding" extends keyof TFeatures ? TableState_RowExpanding : never
  | "RowPagination" extends keyof TFeatures ? TableState_RowPagination : never
  | "RowPinning" extends keyof TFeatures ? TableState_RowPinning : never
  | "RowSelection" extends keyof TFeatures ? TableState_RowSelection : never
| "RowSorting" extends keyof TFeatures ? TableState_RowSorting : never>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

## Defined in

[types/TableState.ts:17](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/types/TableState.ts#L17)

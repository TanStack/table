---
id: TableState
title: TableState
---

# Type Alias: TableState\<TFeatures\>

```ts
type TableState<TFeatures>: "ColumnFiltering" extends keyof TFeatures ? TableState_ColumnFiltering : never & "ColumnGrouping" extends keyof TFeatures ? TableState_ColumnGrouping : never & "ColumnOrdering" extends keyof TFeatures ? TableState_ColumnOrdering : never & "ColumnPinning" extends keyof TFeatures ? TableState_ColumnPinning : never & "ColumnResizing" extends keyof TFeatures ? TableState_ColumnResizing : never & "ColumnSizing" extends keyof TFeatures ? TableState_ColumnSizing : never & "ColumnVisibility" extends keyof TFeatures ? TableState_ColumnVisibility : never & "GlobalFiltering" extends keyof TFeatures ? TableState_GlobalFiltering : never & "RowExpanding" extends keyof TFeatures ? TableState_RowExpanding : never & "RowPagination" extends keyof TFeatures ? TableState_RowPagination : never & "RowPinning" extends keyof TFeatures ? TableState_RowPinning : never & "RowSelection" extends keyof TFeatures ? TableState_RowSelection : never & "RowSorting" extends keyof TFeatures ? TableState_RowSorting : never;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

## Defined in

[types/TableState.ts:66](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableState.ts#L66)

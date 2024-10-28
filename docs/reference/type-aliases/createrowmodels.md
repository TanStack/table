---
id: CreateRowModels
title: CreateRowModels
---

# Type Alias: CreateRowModels\<TFeatures, TData\>

```ts
type CreateRowModels<TFeatures, TData>: CreateRowModel_Core<TFeatures, TData> & UnionToIntersection<
  | "ColumnFaceting" extends keyof TFeatures ? CreateRowModel_Faceted<TFeatures, TData> : never
  | "ColumnFiltering" extends keyof TFeatures ? CreateRowModel_Filtered<TFeatures, TData> : never
  | "RowExpanding" extends keyof TFeatures ? CreateRowModel_Expanded<TFeatures, TData> : never
  | "ColumnGrouping" extends keyof TFeatures ? CreateRowModel_Grouped<TFeatures, TData> : never
  | "RowPagination" extends keyof TFeatures ? CreateRowModel_Paginated<TFeatures, TData> : never
| "RowSorting" extends keyof TFeatures ? CreateRowModel_Sorted<TFeatures, TData> : never>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Defined in

[types/RowModel.ts:33](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L33)

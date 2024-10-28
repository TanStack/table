---
id: CachedRowModels
title: CachedRowModels
---

# Type Alias: CachedRowModels\<TFeatures, TData\>

```ts
type CachedRowModels<TFeatures, TData>: object & UnionToIntersection<
  | "ColumnFaceting" extends keyof TFeatures ? CachedRowModel_Faceted<TFeatures, TData> : never
  | "ColumnFiltering" extends keyof TFeatures ? CachedRowModel_Filtered<TFeatures, TData> : never
  | "RowExpanding" extends keyof TFeatures ? CachedRowModel_Expanded<TFeatures, TData> : never
  | "ColumnGrouping" extends keyof TFeatures ? CachedRowModel_Grouped<TFeatures, TData> : never
  | "RowPagination" extends keyof TFeatures ? CachedRowModel_Paginated<TFeatures, TData> : never
| "RowSorting" extends keyof TFeatures ? CachedRowModel_Sorted<TFeatures, TData> : never>;
```

## Type declaration

### core()?

```ts
optional core: () => RowModel<TFeatures, TData>;
```

#### Returns

[`RowModel`](../interfaces/rowmodel.md)\<`TFeatures`, `TData`\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Defined in

[types/RowModel.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModel.ts#L69)

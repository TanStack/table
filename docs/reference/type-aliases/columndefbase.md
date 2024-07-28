---
id: _ColumnDefBase
title: _ColumnDefBase
---

# Type Alias: \_ColumnDefBase\<TFeatures, TData, TValue\>

```ts
type _ColumnDefBase<TFeatures, TData, TValue>: UnionToIntersection<
  | "ColumnVisibility" extends keyof TFeatures ? ColumnDef_ColumnVisibility : never
  | "ColumnPinning" extends keyof TFeatures ? ColumnDef_ColumnPinning : never
  | "ColumnFiltering" extends keyof TFeatures ? ColumnDef_ColumnFiltering<TFeatures, TData> : never
  | "GlobalFiltering" extends keyof TFeatures ? ColumnDef_GlobalFiltering : never
  | "RowSorting" extends keyof TFeatures ? ColumnDef_RowSorting<TFeatures, TData> : never
  | "ColumnGrouping" extends keyof TFeatures ? ColumnDef_ColumnGrouping<TFeatures, TData, TValue> : never
  | "ColumnSizing" extends keyof TFeatures ? ColumnDef_ColumnSizing : never
  | "ColumnResizing" extends keyof TFeatures ? ColumnDef_ColumnResizing : never> & object;
```

## Type declaration

### cell?

```ts
optional cell: ColumnDefTemplate<CellContext<TFeatures, TData, TValue>>;
```

### footer?

```ts
optional footer: ColumnDefTemplate<HeaderContext<TFeatures, TData, TValue>>;
```

### getUniqueValues?

```ts
optional getUniqueValues: AccessorFn<TData, unknown[]>;
```

### meta?

```ts
optional meta: ColumnMeta<TFeatures, TData, TValue>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Defined in

[types/ColumnDef.ts:59](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/types/ColumnDef.ts#L59)

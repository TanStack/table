---
id: ColumnFilterAutoRemoveTestFn
title: ColumnFilterAutoRemoveTestFn
---

# Type Alias: ColumnFilterAutoRemoveTestFn()\<TFeatures, TData, TValue\>

```ts
type ColumnFilterAutoRemoveTestFn<TFeatures, TData, TValue>: (value, column?) => boolean;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Parameters

• **value**: `any`

• **column?**: [`Column`](column.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`boolean`

## Defined in

[features/column-filtering/ColumnFiltering.types.ts:57](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L57)

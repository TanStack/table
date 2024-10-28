---
id: ColumnFilterAutoRemoveTestFn
title: ColumnFilterAutoRemoveTestFn
---

# Type Alias: ColumnFilterAutoRemoveTestFn()\<TFeatures, TData, TValue\>

```ts
type ColumnFilterAutoRemoveTestFn<TFeatures, TData, TValue>: (value, column?) => boolean;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Parameters

• **value**: `any`

• **column?**: [`Column`](column.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`boolean`

## Defined in

[features/column-filtering/ColumnFiltering.types.ts:65](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L65)

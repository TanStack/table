---
id: TransformFilterValueFn
title: TransformFilterValueFn
---

# Type Alias: TransformFilterValueFn()\<TFeatures, TData, TValue\>

```ts
type TransformFilterValueFn<TFeatures, TData, TValue>: (value, column?) => TValue;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Parameters

• **value**: `any`

• **column?**: [`Column`](column.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`TValue`

## Defined in

[features/column-filtering/ColumnFiltering.types.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L59)

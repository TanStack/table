---
id: ColumnFilterAutoRemoveTestFn
title: ColumnFilterAutoRemoveTestFn
---

# Type Alias: ColumnFilterAutoRemoveTestFn()\<TFeatures, TData, TValue\>

```ts
type ColumnFilterAutoRemoveTestFn<TFeatures, TData, TValue> = (value, column?) => boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:65](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L65)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` *extends* [`CellData`](CellData.md) = [`CellData`](CellData.md)

## Parameters

### value

`any`

### column?

[`Column`](Column.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`boolean`

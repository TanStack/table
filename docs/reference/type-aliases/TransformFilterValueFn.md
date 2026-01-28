---
id: TransformFilterValueFn
title: TransformFilterValueFn
---

# Type Alias: TransformFilterValueFn()\<TFeatures, TData, TValue\>

```ts
type TransformFilterValueFn<TFeatures, TData, TValue> = (value, column?) => TValue;
```

Defined in: [packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L59)

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

`TValue`

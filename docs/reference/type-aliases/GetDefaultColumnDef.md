---
id: GetDefaultColumnDef
title: GetDefaultColumnDef
---

# Type Alias: GetDefaultColumnDef()\<TConstructors\>

```ts
type GetDefaultColumnDef<TConstructors> = <TFeatures, TData, TValue>() => ColumnDefBase_All<TFeatures, TData, TValue> & Partial<TConstructors["ColumnDef"]>;
```

Defined in: [types/TableFeatures.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L55)

## Type Parameters

### TConstructors

`TConstructors` *extends* [`FeatureConstructors`](../interfaces/FeatureConstructors.md)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` *extends* [`CellData`](CellData.md) = [`CellData`](CellData.md)

## Returns

[`ColumnDefBase_All`](ColumnDefBase_All.md)\<`TFeatures`, `TData`, `TValue`\> & `Partial`\<`TConstructors`\[`"ColumnDef"`\]\>

---
id: row_getGroupingValue
title: row_getGroupingValue
---

# Function: row\_getGroupingValue()

```ts
function row_getGroupingValue<TFeatures, TData>(row, columnId): any;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:267](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L267)

Reads and caches this row's grouping value for a column.

`columnDef.getGroupingValue` wins when provided; otherwise the normal row
accessor value is used.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row_Core`](../../index/interfaces/Row_Core.md)\<`TFeatures`, `TData`\> & [`ExtractFeatureMapTypes`](../../index/type-aliases/ExtractFeatureMapTypes.md)\<`TFeatures`, [`Row_FeatureMap`](../../index/interfaces/Row_FeatureMap.md)\<`TFeatures`, `TData`\>\> & `Partial`\<[`Row_ColumnGrouping`](../../index/interfaces/Row_ColumnGrouping.md)\>

### columnId

`string`

## Returns

`any`

## Example

```ts
const groupValue = row_getGroupingValue(row, 'status')
```

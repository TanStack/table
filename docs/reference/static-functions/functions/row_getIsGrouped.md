---
id: row_getIsGrouped
title: row_getIsGrouped
---

# Function: row\_getIsGrouped()

```ts
function row_getIsGrouped<TFeatures, TData>(row): boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:249](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L249)

Checks whether this row was created as a grouped row.

Grouped rows carry a `groupingColumnId`; ordinary leaf rows do not.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row_Core`](../../index/interfaces/Row_Core.md)\<`TFeatures`, `TData`\> & [`ExtractFeatureMapTypes`](../../index/type-aliases/ExtractFeatureMapTypes.md)\<`TFeatures`, [`Row_FeatureMap`](../../index/interfaces/Row_FeatureMap.md)\<`TFeatures`, `TData`\>\> & `Partial`\<[`Row_ColumnGrouping`](../../index/interfaces/Row_ColumnGrouping.md)\>

## Returns

`boolean`

## Example

```ts
const isGrouped = row_getIsGrouped(row)
```

---
id: row_getGroupingValue
title: row_getGroupingValue
---

# Function: row\_getGroupingValue()

```ts
function row_getGroupingValue<TFeatures, TData>(row, columnId): any;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:258](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L258)

Returns grouping value for a row.

This is the static implementation behind the matching row instance API and may read row caches or table state atoms.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row_Core`](../../index/interfaces/Row_Core.md)\<`TFeatures`, `TData`\> & [`UnionToIntersection`](../../index/type-aliases/UnionToIntersection.md)\<
  \| `"columnFilteringFeature"` *extends* keyof `TFeatures` ? [`Row_ColumnFiltering`](../../index/interfaces/Row_ColumnFiltering.md)\<`TFeatures`, `TData`\> : `never`
  \| `"columnGroupingFeature"` *extends* keyof `TFeatures` ? [`Row_ColumnGrouping`](../../index/interfaces/Row_ColumnGrouping.md) : `never`
  \| `"columnPinningFeature"` *extends* keyof `TFeatures` ? [`Row_ColumnPinning`](../../index/interfaces/Row_ColumnPinning.md)\<`TFeatures`, `TData`\> : `never`
  \| `"columnVisibilityFeature"` *extends* keyof `TFeatures` ? [`Row_ColumnVisibility`](../../index/interfaces/Row_ColumnVisibility.md)\<`TFeatures`, `TData`\> : `never`
  \| `"rowExpandingFeature"` *extends* keyof `TFeatures` ? [`Row_RowExpanding`](../../index/interfaces/Row_RowExpanding.md) : `never`
  \| `"rowPinningFeature"` *extends* keyof `TFeatures` ? [`Row_RowPinning`](../../index/interfaces/Row_RowPinning.md) : `never`
  \| `"rowSelectionFeature"` *extends* keyof `TFeatures` ? [`Row_RowSelection`](../../index/interfaces/Row_RowSelection.md) : `never`\> & [`UnionToIntersection`](../../index/type-aliases/UnionToIntersection.md)\<\{ \[K in string \| number \| symbol\]: K extends "coreReativityFeature" ? never : TFeatures\[K\] extends TableFeature\<FeatureConstructorOptions\> ? "Row" extends keyof FeatureConstructorOptions ? FeatureConstructorOptions\[keyof FeatureConstructorOptions & "Row"\] : never : any \}\[keyof `TFeatures`\]\> & [`Row_Plugins`](../../index/interfaces/Row_Plugins.md)\<`TFeatures`, `TData`\> & `Partial`\<[`Row_ColumnGrouping`](../../index/interfaces/Row_ColumnGrouping.md)\>

### columnId

`string`

## Returns

`any`

## Example

```ts
const value = row_getGroupingValue(row)
```

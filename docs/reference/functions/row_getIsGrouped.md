---
id: row_getIsGrouped
title: row_getIsGrouped
---

# Function: row\_getIsGrouped()

```ts
function row_getIsGrouped<TFeatures, TData>(row): boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:130](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L130)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### row

[`Row_Core`](../interfaces/Row_Core.md)\<`TFeatures`, `TData`\> & [`UnionToIntersection`](../type-aliases/UnionToIntersection.md)\<
  \| `"columnFilteringFeature"` *extends* keyof `TFeatures` ? [`Row_ColumnFiltering`](../interfaces/Row_ColumnFiltering.md)\<`TFeatures`, `TData`\> : `never`
  \| `"columnGroupingFeature"` *extends* keyof `TFeatures` ? [`Row_ColumnGrouping`](../interfaces/Row_ColumnGrouping.md) : `never`
  \| `"columnPinningFeature"` *extends* keyof `TFeatures` ? [`Row_ColumnPinning`](../interfaces/Row_ColumnPinning.md)\<`TFeatures`, `TData`\> : `never`
  \| `"columnVisibilityFeature"` *extends* keyof `TFeatures` ? [`Row_ColumnVisibility`](../interfaces/Row_ColumnVisibility.md)\<`TFeatures`, `TData`\> : `never`
  \| `"rowExpandingFeature"` *extends* keyof `TFeatures` ? [`Row_RowExpanding`](../interfaces/Row_RowExpanding.md) : `never`
  \| `"rowPinningFeature"` *extends* keyof `TFeatures` ? [`Row_RowPinning`](../interfaces/Row_RowPinning.md) : `never`
  \| `"rowSelectionFeature"` *extends* keyof `TFeatures` ? [`Row_RowSelection`](../interfaces/Row_RowSelection.md) : `never`\> & [`UnionToIntersection`](../type-aliases/UnionToIntersection.md)\<\{ \[K in string \| number \| symbol\]: TFeatures\[K\] extends TableFeature\<FeatureConstructorOptions\> ? "Row" extends keyof FeatureConstructorOptions ? FeatureConstructorOptions\[keyof FeatureConstructorOptions & "Row"\] : never : any \}\[keyof `TFeatures`\]\> & [`Row_Plugins`](../interfaces/Row_Plugins.md)\<`TFeatures`, `TData`\> & `Partial`\<[`Row_ColumnGrouping`](../interfaces/Row_ColumnGrouping.md)\>

## Returns

`boolean`

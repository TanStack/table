---
id: row_getIsGrouped
title: row_getIsGrouped
---

# Function: row\_getIsGrouped()

```ts
function row_getIsGrouped<TFeatures, TData>(row): boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:250](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L250)

Checks whether this row was created as a grouped row.

Grouped rows carry a `groupingColumnId`; ordinary leaf rows do not.

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

## Returns

`boolean`

## Example

```ts
const isGrouped = row_getIsGrouped(row)
```

---
id: column_getIsVisible
title: column_getIsVisible
---

# Function: column\_getIsVisible()

```ts
function column_getIsVisible<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:64](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L64)

Checks whether this column is visible.

Leaf columns read `state.columnVisibility[column.id]`, where missing entries
default to visible. Parent columns are visible when at least one child column
is visible.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../../index/type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`boolean`

## Example

```ts
const visible = column_getIsVisible(column)
```

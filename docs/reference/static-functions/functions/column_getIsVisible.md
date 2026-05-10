---
id: column_getIsVisible
title: column_getIsVisible
---

# Function: column\_getIsVisible()

```ts
function column_getIsVisible<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L59)

Returns is visible for a column.

This derives the value from the column definition, table options, and the feature state atoms registered on the table.

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
const value = column_getIsVisible(column)
```

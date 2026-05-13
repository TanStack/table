---
id: column_getCanHide
title: column_getCanHide
---

# Function: column\_getCanHide()

```ts
function column_getCanHide<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L85)

Returns whether a column can use hide.

This combines column options, table options, and any required accessor or feature state for the capability.

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
const value = column_getCanHide(column)
```

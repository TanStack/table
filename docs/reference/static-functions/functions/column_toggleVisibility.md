---
id: column_toggleVisibility
title: column_toggleVisibility
---

# Function: column\_toggleVisibility()

```ts
function column_toggleVisibility<TFeatures, TData, TValue>(column, visible?): void;
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L37)

Updates this column's visibility when hiding is allowed.

Passing `visible` stores that value. Omitting it flips the column's current
visibility state. Columns that cannot hide are left unchanged.

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

### visible?

`boolean`

## Returns

`void`

## Example

```ts
column_toggleVisibility(column)
```

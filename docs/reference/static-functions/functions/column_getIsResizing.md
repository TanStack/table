---
id: column_getIsResizing
title: column_getIsResizing
---

# Function: column\_getIsResizing()

```ts
function column_getIsResizing<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/column-resizing/columnResizingFeature.utils.ts:70](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.utils.ts#L70)

Checks whether this column is the active column resize target.

The value is read from `state.columnResizing.isResizingColumn`.

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
const isResizing = column_getIsResizing(column)
```

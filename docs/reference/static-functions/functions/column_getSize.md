---
id: column_getSize
title: column_getSize
---

# Function: column\_getSize()

```ts
function column_getSize<TFeatures, TData, TValue>(column): number;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:63](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L63)

Resolves a column's current pixel size.

Committed `state.columnSizing[column.id]` wins over `columnDef.size`, then the
built-in default size. The result is clamped between min and max size.

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

`number`

## Example

```ts
const width = column_getSize(column)
```

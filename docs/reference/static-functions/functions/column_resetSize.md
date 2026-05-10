---
id: column_resetSize
title: column_resetSize
---

# Function: column\_resetSize()

```ts
function column_resetSize<TFeatures, TData, TValue>(column): void;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:148](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L148)

Reset Size. for a column.

This is the static implementation behind the matching column instance API.

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

`void`

## Example

```ts
const value = column_resetSize(column)
```

---
id: column_resetSize
title: column_resetSize
---

# Function: column\_resetSize()

```ts
function column_resetSize<TFeatures, TData, TValue>(column): void;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:241](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L241)

Removes this column's committed size override.

After reset, the column resolves size from `columnDef.size` or built-in
defaults again.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../../index/interfaces/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`void`

## Example

```ts
column_resetSize(column)
```

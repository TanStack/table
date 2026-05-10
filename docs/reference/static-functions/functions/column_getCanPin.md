---
id: column_getCanPin
title: column_getCanPin
---

# Function: column\_getCanPin()

```ts
function column_getCanPin<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:99](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L99)

Returns whether a column can use pin.

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
const value = column_getCanPin(column)
```

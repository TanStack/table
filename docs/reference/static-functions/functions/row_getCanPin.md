---
id: row_getCanPin
title: row_getCanPin
---

# Function: row\_getCanPin()

```ts
function row_getCanPin<TFeatures, TData>(row): boolean;
```

Defined in: [features/row-pinning/rowPinningFeature.utils.ts:202](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L202)

Returns whether a row can use pin.

This evaluates row data, table options, and feature-specific enablement rules.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Example

```ts
const value = row_getCanPin(row)
```

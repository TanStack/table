---
id: row_getCanPin
title: row_getCanPin
---

# Function: row\_getCanPin()

```ts
function row_getCanPin<TFeatures, TData>(row): boolean;
```

Defined in: [features/row-pinning/rowPinningFeature.utils.ts:213](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L213)

Checks whether this row can be pinned.

`options.enableRowPinning` may be a boolean or a row predicate; it defaults
to `true`.

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
const canPin = row_getCanPin(row)
```

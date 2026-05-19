---
id: table_getBottomRows
title: table_getBottomRows
---

# Function: table\_getBottomRows()

```ts
function table_getBottomRows<TFeatures, TData>(table): Row<TFeatures, TData>[];
```

Defined in: [features/row-pinning/rowPinningFeature.utils.ts:170](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L170)

Resolves the visible rows pinned to the bottom region.

The result follows `state.rowPinning.bottom` order and marks each row with
`position = 'bottom'`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

## Example

```ts
const rows = table_getBottomRows(table)
```

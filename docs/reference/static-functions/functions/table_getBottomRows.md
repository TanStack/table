---
id: table_getBottomRows
title: table_getBottomRows
---

# Function: table\_getBottomRows()

```ts
function table_getBottomRows<TFeatures, TData>(table): Row<TFeatures, TData>[];
```

Defined in: [features/row-pinning/rowPinningFeature.utils.ts:161](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L161)

Returns bottom rows for the table.

This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.

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
const value = table_getBottomRows(table)
```

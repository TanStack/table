---
id: table_getCenterRows
title: table_getCenterRows
---

# Function: table\_getCenterRows()

```ts
function table_getCenterRows<TFeatures, TData>(table): Row<TFeatures, TData>[];
```

Defined in: [features/row-pinning/rowPinningFeature.utils.ts:178](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L178)

Returns center rows for the table.

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
const value = table_getCenterRows(table)
```

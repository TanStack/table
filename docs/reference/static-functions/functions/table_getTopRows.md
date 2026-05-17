---
id: table_getTopRows
title: table_getTopRows
---

# Function: table\_getTopRows()

```ts
function table_getTopRows<TFeatures, TData>(table): Row<TFeatures, TData>[];
```

Defined in: [features/row-pinning/rowPinningFeature.utils.ts:146](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L146)

Returns top rows for the table.

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
const value = table_getTopRows(table)
```

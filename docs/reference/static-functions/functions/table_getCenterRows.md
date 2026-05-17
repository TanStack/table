---
id: table_getCenterRows
title: table_getCenterRows
---

# Function: table\_getCenterRows()

```ts
function table_getCenterRows<TFeatures, TData>(table): Row<TFeatures, TData>[];
```

Defined in: [features/row-pinning/rowPinningFeature.utils.ts:188](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L188)

Resolves rows that are not pinned to top or bottom.

The current row model is filtered by `state.rowPinning.top` and
`state.rowPinning.bottom`.

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
const rows = table_getCenterRows(table)
```

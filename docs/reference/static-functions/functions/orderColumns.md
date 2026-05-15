---
id: orderColumns
title: orderColumns
---

# Function: orderColumns()

```ts
function orderColumns<TFeatures, TData>(table, leafColumns): Column_Internal<TFeatures, TData, unknown>[];
```

Defined in: [features/column-ordering/columnOrderingFeature.utils.ts:191](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.utils.ts#L191)

Orders leaf columns with manual ordering, grouping, and pinning rules.

This helper is used by the column ordering feature to produce the final visible column order.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### leafColumns

[`Column_Internal`](../../index/type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Returns

[`Column_Internal`](../../index/type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Example

```ts
const orderedColumns = orderColumns(leafColumns, columnOrder, grouping, groupedColumnMode)
```

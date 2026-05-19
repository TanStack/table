---
id: orderColumns
title: orderColumns
---

# Function: orderColumns()

```ts
function orderColumns<TFeatures, TData>(table, leafColumns): Column_Internal<TFeatures, TData, unknown>[];
```

Defined in: [features/column-ordering/columnOrderingFeature.utils.ts:203](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.utils.ts#L203)

Applies grouped-column placement rules to an already ordered leaf-column list.

`groupedColumnMode: 'remove'` drops grouped columns from the list.
`groupedColumnMode: 'reorder'` moves grouped columns to the front in grouping
state order.

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
const orderedColumns = orderColumns(table, leafColumns)
```

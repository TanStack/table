---
id: column_getAutoSortDir
title: column_getAutoSortDir
---

# Function: column\_getAutoSortDir()

```ts
function column_getAutoSortDir<TFeatures, TData, TValue>(column, table): "asc" | "desc"
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

`"asc"` \| `"desc"`

## Defined in

[features/row-sorting/RowSorting.utils.ts:115](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.utils.ts#L115)

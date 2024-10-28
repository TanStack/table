---
id: column_getFirstSortDir
title: column_getFirstSortDir
---

# Function: column\_getFirstSortDir()

```ts
function column_getFirstSortDir<TFeatures, TData, TValue>(column): "asc" | "desc"
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column_Internal`](../type-aliases/column_internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`"asc"` \| `"desc"`

## Defined in

[features/row-sorting/RowSorting.utils.ts:207](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.utils.ts#L207)

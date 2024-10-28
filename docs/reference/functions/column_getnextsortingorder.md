---
id: column_getNextSortingOrder
title: column_getNextSortingOrder
---

# Function: column\_getNextSortingOrder()

```ts
function column_getNextSortingOrder<TFeatures, TData, TValue>(column, multi?): false | "asc" | "desc"
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column_Internal`](../type-aliases/column_internal.md)\<`TFeatures`, `TData`, `TValue`\>

• **multi?**: `boolean`

## Returns

`false` \| `"asc"` \| `"desc"`

## Defined in

[features/row-sorting/RowSorting.utils.ts:219](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.utils.ts#L219)

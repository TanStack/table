---
id: column_getAutoSortDir
title: column_getAutoSortDir
---

# Function: column\_getAutoSortDir()

```ts
function column_getAutoSortDir<TFeatures, TData, TValue>(column): "asc" | "desc"
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

[features/row-sorting/RowSorting.utils.ts:70](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.utils.ts#L70)

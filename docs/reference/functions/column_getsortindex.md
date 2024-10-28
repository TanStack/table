---
id: column_getSortIndex
title: column_getSortIndex
---

# Function: column\_getSortIndex()

```ts
function column_getSortIndex<TFeatures, TData, TValue>(column): number
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column_Internal`](../type-aliases/column_internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`number`

## Defined in

[features/row-sorting/RowSorting.utils.ts:276](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.utils.ts#L276)

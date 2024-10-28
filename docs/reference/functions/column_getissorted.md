---
id: column_getIsSorted
title: column_getIsSorted
---

# Function: column\_getIsSorted()

```ts
function column_getIsSorted<TFeatures, TData, TValue>(column): false | SortDirection
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column_Internal`](../type-aliases/column_internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`false` \| [`SortDirection`](../type-aliases/sortdirection.md)

## Defined in

[features/row-sorting/RowSorting.utils.ts:265](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.utils.ts#L265)

---
id: column_clearSorting
title: column_clearSorting
---

# Function: column\_clearSorting()

```ts
function column_clearSorting<TFeatures, TData, TValue>(column): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column_Internal`](../type-aliases/column_internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`void`

## Defined in

[features/row-sorting/RowSorting.utils.ts:287](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.utils.ts#L287)

---
id: column_getToggleSortingHandler
title: column_getToggleSortingHandler
---

# Function: column\_getToggleSortingHandler()

```ts
function column_getToggleSortingHandler<TFeatures, TData, TValue>(column): (e) => void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column_Internal`](../type-aliases/column_internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`Function`

### Parameters

• **e**: `unknown`

### Returns

`void`

## Defined in

[features/row-sorting/RowSorting.utils.ts:298](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.utils.ts#L298)

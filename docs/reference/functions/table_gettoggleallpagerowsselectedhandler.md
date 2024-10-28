---
id: table_getToggleAllPageRowsSelectedHandler
title: table_getToggleAllPageRowsSelectedHandler
---

# Function: table\_getToggleAllPageRowsSelectedHandler()

```ts
function table_getToggleAllPageRowsSelectedHandler<TFeatures, TData>(table): (e) => void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

`Function`

### Parameters

• **e**: `unknown`

### Returns

`void`

## Defined in

[features/row-selection/RowSelection.utils.ts:229](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/RowSelection.utils.ts#L229)

---
id: table_getToggleAllRowsSelectedHandler
title: table_getToggleAllRowsSelectedHandler
---

# Function: table\_getToggleAllRowsSelectedHandler()

```ts
function table_getToggleAllRowsSelectedHandler<TFeatures, TData>(table): (e) => void
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

[features/row-selection/RowSelection.utils.ts:217](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/RowSelection.utils.ts#L217)

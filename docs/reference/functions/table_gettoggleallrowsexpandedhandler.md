---
id: table_getToggleAllRowsExpandedHandler
title: table_getToggleAllRowsExpandedHandler
---

# Function: table\_getToggleAllRowsExpandedHandler()

```ts
function table_getToggleAllRowsExpandedHandler<TFeatures, TData>(table): (e) => void
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

[features/row-expanding/RowExpanding.utils.ts:61](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/RowExpanding.utils.ts#L61)

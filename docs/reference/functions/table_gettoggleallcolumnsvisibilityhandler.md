---
id: table_getToggleAllColumnsVisibilityHandler
title: table_getToggleAllColumnsVisibilityHandler
---

# Function: table\_getToggleAllColumnsVisibilityHandler()

```ts
function table_getToggleAllColumnsVisibilityHandler<TFeatures, TData>(table): (e) => void
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

[features/column-visibility/ColumnVisibility.utils.ts:195](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/ColumnVisibility.utils.ts#L195)

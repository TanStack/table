---
id: row_getToggleSelectedHandler
title: row_getToggleSelectedHandler
---

# Function: row\_getToggleSelectedHandler()

```ts
function row_getToggleSelectedHandler<TFeatures, TData>(row): (e) => void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

## Returns

`Function`

### Parameters

• **e**: `unknown`

### Returns

`void`

## Defined in

[features/row-selection/RowSelection.utils.ts:333](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/RowSelection.utils.ts#L333)

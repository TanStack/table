---
id: table_resetRowSelection
title: table_resetRowSelection
---

# Function: table\_resetRowSelection()

```ts
function table_resetRowSelection<TFeatures, TData>(table, defaultState?): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **defaultState?**: `boolean`

## Returns

`void`

## Defined in

[features/row-selection/RowSelection.utils.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/RowSelection.utils.ts#L24)

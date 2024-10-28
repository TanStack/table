---
id: table_getState
title: table_getState
---

# Function: table\_getState()

```ts
function table_getState<TFeatures, TData>(table): TableState<TFeatures>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

[`TableState`](../type-aliases/tablestate.md)\<`TFeatures`\>

## Defined in

[core/table/Tables.utils.ts:50](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.utils.ts#L50)

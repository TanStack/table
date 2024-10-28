---
id: table_getInitialState
title: table_getInitialState
---

# Function: table\_getInitialState()

```ts
function table_getInitialState<TFeatures, TData>(table): TableState<TFeatures>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

[`TableState`](../type-aliases/tablestate.md)\<`TFeatures`\>

## Defined in

[core/table/Tables.utils.ts:43](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.utils.ts#L43)

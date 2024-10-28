---
id: table_resetColumnSizing
title: table_resetColumnSizing
---

# Function: table\_resetColumnSizing()

```ts
function table_resetColumnSizing<TFeatures, TData>(table, defaultState?): void
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

[features/column-sizing/ColumnSizing.utils.ts:138](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/ColumnSizing.utils.ts#L138)

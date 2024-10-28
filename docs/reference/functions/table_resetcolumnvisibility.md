---
id: table_resetColumnVisibility
title: table_resetColumnVisibility
---

# Function: table\_resetColumnVisibility()

```ts
function table_resetColumnVisibility<TFeatures, TData>(table, defaultState?): void
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

[features/column-visibility/ColumnVisibility.utils.ts:151](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/ColumnVisibility.utils.ts#L151)

---
id: table_resetGlobalFilter
title: table_resetGlobalFilter
---

# Function: table\_resetGlobalFilter()

```ts
function table_resetGlobalFilter<TFeatures, TData>(table, defaultState?): void
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

[features/global-filtering/GlobalFiltering.utils.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/GlobalFiltering.utils.ts#L58)
